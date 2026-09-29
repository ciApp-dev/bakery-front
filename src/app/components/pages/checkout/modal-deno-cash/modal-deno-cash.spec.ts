import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDenoCash } from './modal-deno-cash';

describe('ModalDenoCash', () => {
  let component: ModalDenoCash;
  let fixture: ComponentFixture<ModalDenoCash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDenoCash],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDenoCash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
