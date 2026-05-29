import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSidemenu } from './option-sidemenu';

describe('OptionSidemenu', () => {
  let component: OptionSidemenu;
  let fixture: ComponentFixture<OptionSidemenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionSidemenu],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionSidemenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
