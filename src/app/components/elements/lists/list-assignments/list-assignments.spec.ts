import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssignments } from './list-assignments';

describe('ListAssignments', () => {
  let component: ListAssignments;
  let fixture: ComponentFixture<ListAssignments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAssignments],
    }).compileComponents();

    fixture = TestBed.createComponent(ListAssignments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
