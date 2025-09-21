import { Routes } from '@angular/router';
import { HomeComponent } from '../features/catalog/pages/home/home.component';
import { DeviceDetailComponent } from '../features/catalog/pages/device-detail/device-detail.component';
import { AdminComponent } from '../features/catalog/pages/admin/admin.component';

export const CATALOG_ROUTES: Routes = [
    { path: '', title: 'Catálogo', component: HomeComponent },
    { path: 'device/:id', title: 'Detalle del dispositivo', component: DeviceDetailComponent },
    { path: 'admin', title: 'Administración', component: AdminComponent },
];
