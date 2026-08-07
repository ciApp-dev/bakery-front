import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCategories } from './payments-categories';

describe('PaymentsCategories', () => {
  let component: PaymentsCategories;
  let fixture: ComponentFixture<PaymentsCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
