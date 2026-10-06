import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolPermissionsCategories } from './rol-permissions-categories';

describe('RolPermissionsCategories', () => {
  let component: RolPermissionsCategories;
  let fixture: ComponentFixture<RolPermissionsCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolPermissionsCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(RolPermissionsCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
