import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTransfer } from './register-transfer';

describe('RegisterTransfer', () => {
  let component: RegisterTransfer;
  let fixture: ComponentFixture<RegisterTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterTransfer],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterTransfer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
