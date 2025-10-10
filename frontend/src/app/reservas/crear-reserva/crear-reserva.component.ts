import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../reserva.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Space } from '../../models/space.model';
import { Reservation } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Slot {
  hour: number; // 7..17
  label: string;
  occupied: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-crear-reserva',
  standalone: true, // ❗ importante
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // módulos que usa
  templateUrl: './crear-reserva.component.html',
  styleUrls: ['./crear-reserva.component.scss']
})
export class CrearReservaComponent implements OnInit {

  form: FormGroup;
  spaces: Space[] = [];
  slots: Slot[] = [];
  selectedSpace?: Space;
  selectedDate?: string; // yyyy-MM-dd
  selectedHours: number[] = []; // lista de horas seleccionadas (7..17)
  message = '';

  constructor(private svc: ReservaService, private fb: FormBuilder) {
    this.form = this.fb.group({
      spaceId: [null, Validators.required],
      date: [null, Validators.required],
      title: ['', Validators.required],
      createdBy: ['']
    });
  }

  ngOnInit(): void {
    this.loadSpaces();
    this.buildSlots();
  }

  loadSpaces() {
    this.svc.getSpaces().subscribe(s => this.spaces = s, err => console.error(err));
  }

  buildSlots() {
    this.slots = [];
    for (let h = 7; h <= 17; h++) {
      this.slots.push({
        hour: h,
        label: `${h}:00 - ${h+1}:00`,
        occupied: false,
        selected: false
      });
    }
  }

  onSpaceOrDateChange() {
    this.message = '';
    this.selectedHours = [];
    this.buildSlots();
    const spaceId = this.form.value.spaceId;
    const date = this.form.value.date;
    if (spaceId && date) {
      this.svc.getReservations(spaceId, date).subscribe(res => {
        res.forEach(r => {
          const start = Number(r.startTime.split(':')[0]);
          const end = Number(r.endTime.split(':')[0]);
          for (let h = start; h < end; h++) {
            const slot = this.slots.find(s => s.hour === h);
            if (slot) slot.occupied = true;
          }
        });
      }, err => console.error(err));
    }
  }

  toggleSlot(slot: Slot) {
    if (slot.occupied) return;
    const h = slot.hour;

    if (this.selectedHours.length === 0) {
      this.selectedHours = [h];
    } else {
      const min = Math.min(...this.selectedHours);
      const max = Math.max(...this.selectedHours);

      if (h < min - 1 || h > max + 1) {
        this.selectedHours = [h];
      } else {
        const newSel: number[] = [];
        const newMin = Math.min(min, h);
        const newMax = Math.max(max, h);
        for (let x = newMin; x <= newMax; x++) newSel.push(x);
        for (const hour of newSel) {
          const s = this.slots.find(sl => sl.hour === hour);
          if (s && s.occupied) {
            this.message = 'No se puede seleccionar un rango que incluya horas ocupadas.';
            return;
          }
        }
        this.selectedHours = newSel;
      }
    }

    this.slots.forEach(s => s.selected = this.selectedHours.includes(s.hour));
  }

  confirm() {
    this.message = '';
    if (this.selectedHours.length === 0) {
      this.message = 'Selecciona al menos 1 hora.';
      return;
    }
    if (this.form.invalid) {
      this.message = 'Completa los datos (espacio, fecha, título).';
      return;
    }
    const startHour = Math.min(...this.selectedHours);
    const endHour = Math.max(...this.selectedHours) + 1;
    const payload: Reservation = {
      spaceId: this.form.value.spaceId,
      date: this.form.value.date,
      startTime: `${String(startHour).padStart(2,'0')}:00`,
      endTime: `${String(endHour).padStart(2,'0')}:00`,
      title: this.form.value.title,
      createdBy: this.form.value.createdBy || 'Anon'
    };

    this.svc.createReservation(payload).subscribe({
      next: () => {
        this.message = 'Reserva creada correctamente.';
        this.onSpaceOrDateChange();
        this.selectedHours = [];
        this.form.patchValue({ title: '' });
      },
      error: err => {
        console.error(err);
        this.message = err?.error?.error || 'Error creando reserva.';
      }
    });
  }
}
