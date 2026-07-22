import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registers } from './registers';

describe('Registers', () => {
  let component: Registers;
  let fixture: ComponentFixture<Registers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registers],
    }).compileComponents();

    fixture = TestBed.createComponent(Registers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
