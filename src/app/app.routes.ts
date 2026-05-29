import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { DashboardOverviewPage } from './components/pages/dashboard/dashboard-overview-page';
import { DashboardSectionPlaceholderPage } from './components/pages/dashboard/dashboard-section-placeholder-page';
import { RegisterComponent } from './components/pages/register/register';


export const routes: Routes = [
    { path: "login", component: LoginComponent},
    { path: "register", component: RegisterComponent},
    {
        path: "dashboard",
        component: Dashboard,
        children: [
            { path: "", redirectTo: "overview", pathMatch: "full" },
            { path: "overview", component: DashboardOverviewPage },
            {
                path: "sales",
                component: DashboardSectionPlaceholderPage,
                data: {
                    title: 'Ventas',
                    description: 'Inserta aqui tu pantalla de ventas.',
                    placeholder: 'Area lista para app-ventas',
                },
            },
            {
                path: "inventory",
                component: DashboardSectionPlaceholderPage,
                data: {
                    title: 'Inventario',
                    description: 'Inserta aqui tu pantalla de inventario.',
                    placeholder: 'Area lista para app-inventario',
                },
            },
            {
                path: "orders",
                component: DashboardSectionPlaceholderPage,
                data: {
                    title: 'Pedidos',
                    description: 'Inserta aqui tu pantalla de pedidos.',
                    placeholder: 'Area lista para app-pedidos',
                },
            },
            {
                path: "customers",
                component: DashboardSectionPlaceholderPage,
                data: {
                    title: 'Clientes',
                    description: 'Inserta aqui tu pantalla de clientes.',
                    placeholder: 'Area lista para app-clientes',
                },
            },
            {
                path: "reports",
                component: DashboardSectionPlaceholderPage,
                data: {
                    title: 'Reportes',
                    description: 'Inserta aqui tu pantalla de reportes.',
                    placeholder: 'Area lista para app-reportes',
                },
            },
        ],
    },
    { path: "", redirectTo: "/login", pathMatch: "full" }
    
];
