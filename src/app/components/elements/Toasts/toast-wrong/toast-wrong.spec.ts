import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastWrong } from './toast-wrong';

describe('ToastWrong', () => {
  let component: ToastWrong;
  let fixture: ComponentFixture<ToastWrong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastWrong],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastWrong);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
