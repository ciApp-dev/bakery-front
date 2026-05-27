import { Component, signal, input } from '@angular/core';
import { PassInputsButton } from "../../pass-inputs-button/pass-inputs-button";

@Component({
  selector: 'app-input-pass',
  imports: [PassInputsButton],
  templateUrl: './input-pass.html',
  styleUrl: './input-pass.css',
})
export class InputPass {

  showPassword = signal<boolean>(false);

  label =  input.required<string>();
}
