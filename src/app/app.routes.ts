import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login';
import { DashboardComponents } from './components/pages/dashboard/dashboard';
import { RegisterComponent } from './components/pages/register/register';


export const routes: Routes = [
    { path: "login", component: LoginComponent},
    { path: "register", component: RegisterComponent},
    { path: "dashboard", component: DashboardComponents},
    { path: "", redirectTo: "/login", pathMatch: "full" }
    
];
