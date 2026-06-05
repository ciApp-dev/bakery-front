import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { DashboardOverviewPage } from './components/pages/dashboard/dashboard-overview-page';
import { DashboardSectionPlaceholderPage } from './components/pages/dashboard/dashboard-section-placeholder-page';
import { RegisterComponent } from './components/pages/register/register';


export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    {
        path: "dashboard",
        component: Dashboard,
        children: [
            { path: "", redirectTo: "overview", pathMatch: "full" },

            { path: "overview", component: DashboardOverviewPage },
            {
                path: "sucursales",
                component: DashboardSectionPlaceholderPage,
                data: {
                    title: 'Sucursales',
                    description: 'Inserta aqui tu pantalla de sucursales.',
                    placeholder: 'Area lista para app-sucursales',
                },
            },
  
            { path: "**", redirectTo: "overview" }
        ],
    },
    { path: "**", redirectTo: "login", pathMatch: "full" }

];
