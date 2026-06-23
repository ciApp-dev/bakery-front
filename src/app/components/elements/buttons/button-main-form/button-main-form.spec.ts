import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonMainForm } from './button-main-form';

describe('ButtonMainForm', () => {
  let component: ButtonMainForm;
  let fixture: ComponentFixture<ButtonMainForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonMainForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonMainForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
