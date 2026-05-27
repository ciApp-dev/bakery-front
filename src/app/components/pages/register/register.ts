import { Component, inject,signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterService } from 'src/app/service/register-service';
import { InputLabel } from '../../elements/inputs/input-label/input-label';
import { PassInputsButton } from '../../elements/pass-inputs-button/pass-inputs-button';
import { InputPass } from '../../elements/inputs/input-pass/input-pass';




@Component({
  selector: 'app-register',
  imports: [RouterLink, InputLabel, PassInputsButton, InputPass],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  registerService = inject(RegisterService);

  showPassword = signal<boolean>(false);

  saveUser(){
    this.registerService.saveUser([]).subscribe(response => {
      console.log('User saved successfully', response);
    },
    error => {
      console.error('Error saving user', error);
    });
  }
}
