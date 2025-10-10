// app.routes.ts
import { Routes } from '@angular/router';
import { CrearReservaComponent } from './reservas/crear-reserva/crear-reserva.component';

export const routes: Routes = [
  { path: 'reservas', component: CrearReservaComponent },
  { path: '', redirectTo: 'reservas', pathMatch: 'full' },
  { path: '**', redirectTo: 'reservas' }
];
