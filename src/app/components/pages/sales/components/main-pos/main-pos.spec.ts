import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPos } from './main-pos';

describe('MainPos', () => {
  let component: MainPos;
  let fixture: ComponentFixture<MainPos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPos],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
