import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pass-inputs-button',
  imports: [],
  templateUrl: './pass-inputs-button.html',
  styleUrl: './pass-inputs-button.css',
})
export class PassInputsButton {
  showPassword = input.required<boolean>();
  showPasswordChange = output<boolean>();

  togglePassword() {
    this.showPasswordChange.emit(!this.showPassword());
  }
 
  
}
