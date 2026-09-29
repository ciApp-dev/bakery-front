import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutRegister } from './out-register';

describe('OutRegister', () => {
  let component: OutRegister;
  let fixture: ComponentFixture<OutRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(OutRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
