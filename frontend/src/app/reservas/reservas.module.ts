import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrearReservaComponent } from './crear-reserva/crear-reserva.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: CrearReservaComponent } // ruta cuando se cargue /reservas
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    CrearReservaComponent // ✅ Importar el componente standalone aquí
  ],
  
})
export class ReservasModule { }
