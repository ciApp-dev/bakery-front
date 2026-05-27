import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSolo } from './input-solo';

describe('InputSolo', () => {
  let component: InputSolo;
  let fixture: ComponentFixture<InputSolo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSolo],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSolo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
