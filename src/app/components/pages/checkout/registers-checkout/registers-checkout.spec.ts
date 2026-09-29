import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersCheckout } from './registers-checkout';

describe('RegistersCheckout', () => {
  let component: RegistersCheckout;
  let fixture: ComponentFixture<RegistersCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistersCheckout],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistersCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
