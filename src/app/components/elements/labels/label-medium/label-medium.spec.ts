import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelMedium } from './label-medium';

describe('LabelMedium', () => {
  let component: LabelMedium;
  let fixture: ComponentFixture<LabelMedium>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelMedium],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelMedium);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
