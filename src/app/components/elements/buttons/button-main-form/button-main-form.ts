import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-main-form',
  imports: [],
  templateUrl: './button-main-form.html',
  styleUrl: './button-main-form.css',
})
export class ButtonMainForm {
  label = input.required<string>();
  iconName = input.required<string | null>();
  pressed = output<void>();

  onPress(): void {
    this.pressed.emit();
  }
}
