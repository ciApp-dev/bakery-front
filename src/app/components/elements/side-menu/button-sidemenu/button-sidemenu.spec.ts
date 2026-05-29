import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSidemenu } from './button-sidemenu';

describe('ButtonSidemenu', () => {
  let component: ButtonSidemenu;
  let fixture: ComponentFixture<ButtonSidemenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSidemenu],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonSidemenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
