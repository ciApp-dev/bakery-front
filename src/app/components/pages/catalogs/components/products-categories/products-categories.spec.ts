import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCategories } from './products-categories';

describe('ProductsCategories', () => {
  let component: ProductsCategories;
  let fixture: ComponentFixture<ProductsCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
