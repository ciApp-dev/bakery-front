import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSidemenu } from './footer-sidemenu';

describe('FooterSidemenu', () => {
  let component: FooterSidemenu;
  let fixture: ComponentFixture<FooterSidemenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSidemenu],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterSidemenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
