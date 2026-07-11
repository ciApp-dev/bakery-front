import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceRegister } from './entrance-register';

describe('EntranceRegister', () => {
  let component: EntranceRegister;
  let fixture: ComponentFixture<EntranceRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntranceRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(EntranceRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
