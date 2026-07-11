import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOut } from './register-out';

describe('RegisterOut', () => {
  let component: RegisterOut;
  let fixture: ComponentFixture<RegisterOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterOut],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterOut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
