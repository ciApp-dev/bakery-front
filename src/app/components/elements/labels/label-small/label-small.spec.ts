import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelSmall } from './label-small';

describe('LabelSmall', () => {
  let component: LabelSmall;
  let fixture: ComponentFixture<LabelSmall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelSmall],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelSmall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
