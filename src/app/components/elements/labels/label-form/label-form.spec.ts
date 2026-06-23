import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelForm } from './label-form';

describe('LabelForm', () => {
  let component: LabelForm;
  let fixture: ComponentFixture<LabelForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
