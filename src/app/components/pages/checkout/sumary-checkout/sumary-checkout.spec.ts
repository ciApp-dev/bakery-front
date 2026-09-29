import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumaryCheckout } from './sumary-checkout';

describe('SumaryCheckout', () => {
  let component: SumaryCheckout;
  let fixture: ComponentFixture<SumaryCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SumaryCheckout],
    }).compileComponents();

    fixture = TestBed.createComponent(SumaryCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
