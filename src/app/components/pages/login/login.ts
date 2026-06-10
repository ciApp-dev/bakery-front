import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputPassSolo } from "../../elements/inputs/input-pass-solo/input-pass-solo";
import { InputSolo } from "../../elements/inputs/input-solo/input-solo";
import { environment } from '@environments/environment.development';
import { LoginResponse, LoginUserRequest } from 'src/app/interfaces/responses';
import { LoginService } from 'src/app/service/login-service';
import { ToastService } from 'src/app/service/toast-service';


@Component({
  selector: 'app-login',
  imports: [RouterLink, InputPassSolo, InputSolo],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginService = inject(LoginService);
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
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('id_user', response.user.id.toString());

      },
      error: (error) => {
        this.tostService.showErrorToast('Error al iniciar sesión', 'Por favor, verifica tus credenciales e intenta nuevamente.');
      }
    });
  }

  

  
}
