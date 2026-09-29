import { Component, computed, input, output } from '@angular/core';
import { environment } from '@environments/environment';

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
  color = input<string | null>(null);

  protected readonly buttonClasses = computed(() => {
    const colorClass = this.color() ?? environment.btnMainFormBgColor;
    return `${colorClass}`;
  });

  onPress(): void {
    this.pressed.emit();
  }
}
