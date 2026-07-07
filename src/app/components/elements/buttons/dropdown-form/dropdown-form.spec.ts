import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownForm } from './dropdown-form';

describe('DropdownForm', () => {
  let component: DropdownForm;
  let fixture: ComponentFixture<DropdownForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
