import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterService } from 'src/app/service/register-service';
import { ToastService } from 'src/app/service/toast-service';
import { InputLabel } from '../../elements/inputs/input-label/input-label';
import { InputPass } from '../../elements/inputs/input-pass/input-pass';
import { RegisterUserRequest } from '../../../interfaces/responses';
import { ErrorformatterService } from 'src/app/service/errorformatter-service';




@Component({
  selector: 'app-register',
  imports: [RouterLink, InputLabel, InputPass],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  registerService = inject(RegisterService);
  errorFormatter = inject(ErrorformatterService);
  toastService = inject(ToastService);

  readonly email = signal('');
  readonly password = signal('');
  readonly passwordConfirmation = signal('');
  readonly name = signal('');
  readonly lastName = signal('');

 

  onEmailChange(value: string): void {
    this.email.set(value);
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
  }

  onPasswordConfirmationChange(value: string): void {
    this.passwordConfirmation.set(value);
  }

  onNameChange(value: string): void {
    this.name.set(value);
  }

  onLastNameChange(value: string): void {
    this.lastName.set(value);
  }

  createAccount(event: Event): void {
    event.preventDefault();
    const user: RegisterUserRequest = {
      name: this.name() + ' ' + this.lastName(),
      email: this.email(),
      password: this.password(),
      password_confirmation: this.passwordConfirmation(),
      estado: 'PEN',
    };
    

    this.saveUser(user);

    
  
  }

  saveUser(user: RegisterUserRequest): void {
    this.registerService.saveUser(user).subscribe(response => {
      this.toastService.showSuccessToast('Usuario registrado correctamente');
      this.clearForm();
    },
    (error: HttpErrorResponse) => {
      const apiError = error.error as {
        message?: string;
        errors?: Record<string, string[]>;
      };

      const message = apiError?.message ?? 'No se pudo completar el registro.';
      const messageDetails = this.errorFormatter.buildMessageDetails(apiError?.errors);

      this.toastService.showErrorToast(message, messageDetails);
    });
  }
  
  clearForm(): void {
    this.email.set('');
    this.password.set('');
    this.passwordConfirmation.set('');
    this.name.set('');
    this.lastName.set('');
  }
 

   

  

}
