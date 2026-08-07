import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinActivity } from './join-activity';

describe('JoinActivity', () => {
  let component: JoinActivity;
  let fixture: ComponentFixture<JoinActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinActivity],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinActivity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
