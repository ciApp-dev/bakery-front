import { Component,signal,input } from '@angular/core';
import { PassInputsButton } from "../../pass-inputs-button/pass-inputs-button";

@Component({
  selector: 'app-input-pass-solo',
  imports: [PassInputsButton],
  templateUrl: './input-pass-solo.html',
  styleUrl: './input-pass-solo.css',
})
export class InputPassSolo {

  showPassword = signal<boolean>(false);

  label =  input.required<string>();
}
