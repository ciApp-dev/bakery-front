import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassInputs } from './pass-inputs-button';

describe('PassInputs', () => {
  let component: PassInputs;
  let fixture: ComponentFixture<PassInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassInputs],
    }).compileComponents();

    fixture = TestBed.createComponent(PassInputs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
