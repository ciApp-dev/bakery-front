import { Component,input, output } from '@angular/core';

@Component({
  selector: 'app-button-secundary-form',
  imports: [],
  templateUrl: './button-secundary-form.html',
  styleUrl: './button-secundary-form.css',
})
export class ButtonSecundaryForm {
  label = input.required<string>();
  iconName = input.required<string | null>();
  color = input.required<string | null>();
  pressed = output<void>();

  onPress(): void {
    this.pressed.emit();
  }
}
