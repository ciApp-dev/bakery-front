import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InRegister } from './in-register';

describe('InRegister', () => {
  let component: InRegister;
  let fixture: ComponentFixture<InRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(InRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
