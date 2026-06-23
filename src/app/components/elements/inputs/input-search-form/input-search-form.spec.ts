import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSearchForm } from './input-search-form';

describe('InputSearchForm', () => {
  let component: InputSearchForm;
  let fixture: ComponentFixture<InputSearchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSearchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSearchForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
