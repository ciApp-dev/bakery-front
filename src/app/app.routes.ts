import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { DashboardOverviewPage } from './components/pages/dashboard/dashboard-overview-page';
import { RegisterComponent } from './components/pages/register/register';
import { ProductosComponent } from './components/pages/productos/productos';
import { SucursalesComponent } from './components/pages/sucursales/sucursales';
import { InventarioComponent } from './components/pages/inventario/inventario';
import { SalesComponent } from './components/pages/sales/sales';


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
                path: "productos",
                component: ProductosComponent
                
            },
            {
                path: "sucursales",
                component: SucursalesComponent
            },
            {
                path: "inventario",
                component: InventarioComponent
            },
            {
                path: "sales",
                component: SalesComponent
            },
  
            { path: "**", redirectTo: "overview" }
        ],
    },
    { path: "**", redirectTo: "login", pathMatch: "full" }

];
