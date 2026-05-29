import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSidemenu } from './header-sidemenu';

describe('HeaderSidemenu', () => {
  let component: HeaderSidemenu;
  let fixture: ComponentFixture<HeaderSidemenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSidemenu],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderSidemenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
