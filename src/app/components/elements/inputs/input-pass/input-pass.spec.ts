import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPass } from './input-pass';

describe('InputPass', () => {
  let component: InputPass;
  let fixture: ComponentFixture<InputPass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPass],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
