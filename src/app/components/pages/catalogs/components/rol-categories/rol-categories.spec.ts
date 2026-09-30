import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolCategories } from './rol-categories';

describe('RolCategories', () => {
  let component: RolCategories;
  let fixture: ComponentFixture<RolCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(RolCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
