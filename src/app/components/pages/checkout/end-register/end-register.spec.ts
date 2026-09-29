import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndRegister } from './end-register';

describe('EndRegister', () => {
  let component: EndRegister;
  let fixture: ComponentFixture<EndRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(EndRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
