import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Redirección explícita de la raíz al login
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },

  // 2. Rutas públicas con Lazy Loading y Títulos
  { 
    path: 'login', 
    title: 'Iniciar Sesión',
    loadComponent: () => import('./components/pages/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    title: 'Registro',
    loadComponent: () => import('./components/pages/register/register').then(m => m.RegisterComponent) 
  },

  // 3. Panel principal
  {
    path: 'dashboard',
    title: 'Dashboard',
    // canActivate: [authGuard], // Descomentar si usas AuthGuard
    loadComponent: () => import('./components/pages/dashboard/dashboard').then(m => m.Dashboard),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      /*{
        path: 'overview',
        title: 'Dashboard | Resumen',
        loadComponent: () => import('./components/pages/dashboard/dashboard-overview-page').then(m => m.DashboardOverviewPage)
      },*/
      {
        path: 'summary',
        title: 'Dashboard | Summary',
        loadComponent: () => import('./components/pages/summary/summary').then(m => m.SummaryComponent)
      },
      {
        path: 'productos',
        title: 'Dashboard | Productos',
        loadComponent: () => import('./components/pages/productos/productos').then(m => m.ProductosComponent)
      },
      {
        path: 'sucursales',
        title: 'Dashboard | Sucursales',
        loadComponent: () => import('./components/pages/sucursales/sucursales').then(m => m.SucursalesComponent)
      },
      {
        path: 'inventario',
        title: 'Dashboard | Inventario',
        loadComponent: () => import('./components/pages/inventario/inventario').then(m => m.InventarioComponent)
      },
      {
        path: 'sales',
        title: 'Dashboard | Ventas',
        loadComponent: () => import('./components/pages/sales/sales').then(m => m.SalesComponent)
      },
      {
        path: 'catalogs',
        title: 'Dashboard | Catálogos',
        loadComponent: () => import('./components/pages/catalogs/catalogs').then(m => m.CatalogsComponent)
      },
      {
        path: 'customers',
        title: 'Dashboard | Clientes',
        loadComponent: () => import('./components/pages/customers/customers').then(m => m.CustomersComponent)
      },
      { 
        path: '**', 
        redirectTo: 'overview' 
      }
    ],
  },

  // 4. Captura de rutas no existentes a nivel global
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];