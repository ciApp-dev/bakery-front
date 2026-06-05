import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastSuccessfullyComponent } from './toast-successfully';

describe('ToastSuccessfully', () => {
  let component: ToastSuccessfullyComponent;
  let fixture: ComponentFixture<ToastSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastSuccessfullyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastSuccessfullyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
