import { Component, computed, inject, signal,input } from '@angular/core';
import { PermissionsService } from 'src/app/service/permissions-service';
import { InputSearchForm } from "../../elements/inputs/input-search-form/input-search-form";
import { ButtonMainForm } from "../../elements/buttons/button-main-form/button-main-form";
import { ButtonSecundaryForm } from "../../elements/buttons/button-secundary-form/button-secundary-form";
import { LabelForm } from "../../elements/labels/label-form/label-form";
import { InputForm } from "../../elements/inputs/input-form/input-form";
import { SelectorForm } from "../../elements/selectors/selector-form/selector-form";
import { ProductSendData, SelectorOption } from 'src/app/interfaces/forms';
import { TableForm } from "../../elements/tables/table-form/table-form";
import { ContentLabelTable, ProductTableRow, RowActionEvent } from 'src/app/interfaces/forms';
import { CategoriaService } from 'src/app/service/categoria-service';
import { ProductosService } from 'src/app/service/productos-service';
import { ToastService } from 'src/app/service/toast-service';




@Component({
  selector: 'app-productos',
  imports: [InputSearchForm, ButtonMainForm, ButtonSecundaryForm, LabelForm, InputForm, SelectorForm, TableForm],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent {

  //Services

  categoriaService = inject(CategoriaService);
  permissionns = inject(PermissionsService);
  productosService = inject(ProductosService);
  toastService = inject(ToastService);

  //Signals

  options = signal<SelectorOption[]>([]);
  name = signal('');
  price = signal(0);
  code = signal('');
  description = signal('');
  idCategory = signal<number | null>(null);

  modeForm = signal<string>('create');

  
  showCreateSection = signal(false);
 
  
  readonly test = signal('test');

  productName: ContentLabelTable[] = [
    { id: 1, name: 'Name', key: 'name' },
    { id: 2, name: 'Category', key: 'category' },
    { id: 3, name: 'Price', key: 'price' },
    { id: 4, name: 'Code', key: 'code' },
    { id: 5, name: 'Description', key: 'description' },
    { id: 6, name: 'Actions', key: 'actions' }
  ];

  productRows: ProductTableRow[] = [
    { id: 1, name: 'Sourdough Bread', category: 'Bakery', price: 6.5, code: 'SKU-01', description: 'A delicious sourdough bread' },
    { id: 2, name: 'Vanilla Cupcake', category: 'Pastry', price: 3.2, code: 'SKU-02', description: 'A tasty vanilla cupcake' },
    { id: 3, name: 'Chocolate Donut', category: 'Dessert', price: 2.8, code: 'SKU-03', description: 'A rich chocolate donut' },
    { id: 4, name: 'Croissant', category: 'Bakery', price: 4.1, code: 'SKU-04', description: 'A buttery croissant' },
    { id: 5, name: 'Sourdough Bread', category: 'Bakery', price: 6.5, code: 'SKU-05', description: 'A delicious sourdough bread' },
    { id: 6, name: 'Vanilla Cupcake', category: 'Pastry', price: 3.2, code: 'SKU-06', description: 'A tasty vanilla cupcake' },
    { id: 7, name: 'Chocolate Donut', category: 'Dessert', price: 2.8, code: 'SKU-07', description: 'A rich chocolate donut' },
    { id: 8, name: 'Croissant', category: 'Bakery', price: 4.1, code: 'SKU-08', description: 'A buttery croissant' },
    { id: 9, name: 'Sourdough Bread', category: 'Bakery', price: 6.5, code: 'SKU-09', description: 'A delicious sourdough bread' },
    { id: 10, name: 'Vanilla Cupcake', category: 'Pastry', price: 3.2, code: 'SKU-10', description: 'A tasty vanilla cupcake' },
    { id: 11, name: 'Chocolate Donut', category: 'Dessert', price: 2.8, code: 'SKU-11', description: 'A rich chocolate donut' },
    { id: 12, name: 'Croissant', category: 'Bakery', price: 4.1, code: 'SKU-12', description: 'A buttery croissant' },
  ];


  constructor() {
    this.getCategories();
  }



  onNameChange(value: string | number): void {
    this.name.set(String(value));
  }

  onPriceChange(value: string | number): void {
    const numericValue = typeof value === 'number' ? value : Number(value);
    this.price.set(numericValue);
  }

  onCodeChange(value: string | number): void {
    this.code.set(String(value));
  }

  onDescriptionChange(value: string | number): void {
    this.description.set(String(value));
  }


 

  editProduct(event: RowActionEvent<ProductTableRow>): void {
    
    this.modeForm.set('edit');
    this.showCreateSection.set(true);

    this.onNameChange(event.row.name);
    this.onPriceChange(event.row.price);
    this.onCodeChange(event.row.code);
    this.onDescriptionChange(event.row.description);
    const matchedCategory = this.options().find(
      (option) => option.nombre.toLowerCase() === String(event.row.category).toLowerCase()
    );

    if (matchedCategory) {
      this.idCategory.set(Number(matchedCategory.id));
    } else {
      const categoryAsNumber = Number(event.row.category);
      this.idCategory.set(Number.isNaN(categoryAsNumber) ? null : categoryAsNumber);
    }
    

    console.log('Edit product with ID:', event.id);
    console.log('Product details:', event.row);
  }

  saveProduct(): void {
    const productData: ProductSendData = {
      nombre: this.name(),
      codigo: this.code(),
      categoria_id: this.idCategory(),
      descripcion: this.description(),
      precio: this.price(),
      user_id: localStorage.getItem('id_user') ? Number(localStorage.getItem('id_user')) : 0 // Replace with actual user ID
    };

    this.productosService.saveProduct(productData).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Producto regfistrado con éxito');
        console.log('Product saved successfully:', response);
        this.cancelSave();
      },
      error: (error) => {
        console.error('Error saving product:', error);

        
      }
    });
    
  }


  cancelSave(): void {
    
    this.modeForm.set('create');
    this.name.set('');
    this.price.set(0);
    this.code.set('');
    this.description.set('');
    this.idCategory.set(null);
    
  }
  
  getCategories(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categories) => {
        console.log('Fetched categories:', categories);
        this.options.set(categories.map(category => ({ id: category.id, nombre: category.nombre })));
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  } 
  
}
