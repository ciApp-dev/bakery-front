import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBranch } from './user-branch';

describe('UserBranch', () => {
  let component: UserBranch;
  let fixture: ComponentFixture<UserBranch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBranch],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBranch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
