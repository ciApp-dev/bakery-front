import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStatus } from './table-status';

describe('TableStatus', () => {
  let component: TableStatus;
  let fixture: ComponentFixture<TableStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(TableStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
