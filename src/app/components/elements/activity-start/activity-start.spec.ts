import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityStartComponent } from './activity-start';

describe('ActivityStartComponent', () => {
  let component: ActivityStartComponent;
  let fixture: ComponentFixture<ActivityStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityStartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
