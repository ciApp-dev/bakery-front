import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSecundaryForm } from './button-secundary-form';

describe('ButtonSecundaryForm', () => {
  let component: ButtonSecundaryForm;
  let fixture: ComponentFixture<ButtonSecundaryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSecundaryForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonSecundaryForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
