import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputPassSolo } from "../../elements/inputs/input-pass-solo/input-pass-solo";
import { InputSolo } from "../../elements/inputs/input-solo/input-solo";
import { environment } from '@environments/environment.development';


@Component({
  selector: 'app-login',
  imports: [RouterLink, InputPassSolo, InputSolo],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  showPassword = signal<boolean>(false);
  email = signal<string>('');

  darkModeDiv = environment.darkModeDiv;
  darkModeText = environment.darkModeText;

  onEmailChange(value: string): void {
    this.email.set(value);
  }

  

  
}
