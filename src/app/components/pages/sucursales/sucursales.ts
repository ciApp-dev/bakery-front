import { Component,signal } from '@angular/core';
import { InputSearchForm } from "../../elements/inputs/input-search-form/input-search-form";
import { ButtonMainForm } from "../../elements/buttons/button-main-form/button-main-form";
import { LabelForm } from "../../elements/labels/label-form/label-form";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputForm } from "../../elements/inputs/input-form/input-form";
import { ButtonSecundaryForm } from "../../elements/buttons/button-secundary-form/button-secundary-form";
import { ToggleSwitch } from "../../elements/toggle-switch/toggle-switch";

@Component({
  selector: 'app-sucursales',
  imports: [InputSearchForm, ButtonMainForm, LabelForm, InputForm, ButtonSecundaryForm, ReactiveFormsModule, ToggleSwitch],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css',
})
export class SucursalesComponent {
  private readonly phonePattern = /^\d{3} \d{3} \d{4}$/;



  branchActive = signal(false);
  modeForm = signal<string>('create');

  //FORM
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.phonePattern)]),
    address: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)]),
  });

  showCreateSection = signal<boolean>(false);


  constructor() {
  
  }

  onNameChange(value: string | number): void {
    const parsedValue = String(value); 
    this.form.get('name')?.setValue(parsedValue);
    this.form.get('name')?.markAsTouched();
  }

  onPhoneChange(value: string | number): void {
    const parsedValue = String(value);
    this.form.get('phone')?.setValue(parsedValue);
    this.form.get('phone')?.markAsTouched();
  }

  onAddressChange(value: string | number): void {
    const parsedValue = String(value);
    this.form.get('address')?.setValue(parsedValue);
    this.form.get('address')?.markAsTouched();
  }

  onPostalCodeChange(value: string | number): void {
    const parsedValue = String(value);
    this.form.get('postalCode')?.setValue(parsedValue);
    this.form.get('postalCode')?.markAsTouched();
  }

  onBranchActiveChange(value: boolean): void {
    this.branchActive.set(value);
  }

  saveSucursal(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  cancelSave(): void {
    this.form.reset({
      name: '',
      phone: '',
      address: '',
      postalCode: '',
    });
    this.branchActive.set(true);
    this.form.markAsUntouched();
    this.showCreateSection.set(false);
  }



}
