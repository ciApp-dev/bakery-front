import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSidemenuTrick } from './button-sidemenu-trick';

describe('ButtonSidemenuTrick', () => {
  let component: ButtonSidemenuTrick;
  let fixture: ComponentFixture<ButtonSidemenuTrick>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSidemenuTrick],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonSidemenuTrick);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
