import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { InputPassSolo } from "../../elements/inputs/input-pass-solo/input-pass-solo";
import { InputSolo } from "../../elements/inputs/input-solo/input-solo";
import { environment } from '@environments/environment.development';
import { LoginResponse, LoginUserRequest } from 'src/app/interfaces/responses';
import { LoginService } from 'src/app/service/login-service';
import { PermissionsService } from 'src/app/service/permissions-service';
import { ToastService } from 'src/app/service/toast-service';


@Component({
  selector: 'app-login',
  imports: [RouterLink, InputPassSolo, InputSolo],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  router = inject(Router);
  loginService = inject(LoginService);
  permissionsService = inject(PermissionsService);
  tostService = inject(ToastService);

  showPassword = signal<boolean>(false);
  email = signal<string>('');
  password = signal<string>('');

  darkModeDiv = environment.darkModeDiv;
  darkModeText = environment.darkModeText;

  onEmailChange(value: string): void {
    this.email.set(value);
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
  }

  loggin(event: Event): void {
    event.preventDefault();
    
    const loginData: LoginUserRequest = {
      email: this.email(),
      password: this.password(),
    };

    this.loginUser(loginData);
  }

  loginUser(loginData: LoginUserRequest): void {
    this.loginService.loginUser(loginData).subscribe({
      next: (response: LoginResponse) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('name_user', response.user.name);
        localStorage.setItem('id_user', response.user.id.toString());
        localStorage.setItem('estado_user', response.user.estado);
        localStorage.setItem('nameSucursal', response.user.sucursales[0].name);
        localStorage.setItem('idSucursal', response.user.sucursales[0].id.toString());
        this.permissionsService.setPermissions(response.user.permissions);
        this.router.navigate(['/dashboard']);

        console.log('Login successful:', response); // Log the successful login response
      },
      error: (error) => {
        this.tostService.showErrorToast('Error al iniciar sesión', 'Por favor, verifica tus credenciales e intenta nuevamente.');
      }
    });
  }

  

  
}
