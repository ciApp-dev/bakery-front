import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPassSolo } from './input-pass-solo';

describe('InputPassSolo', () => {
  let component: InputPassSolo;
  let fixture: ComponentFixture<InputPassSolo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPassSolo],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPassSolo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
