import { Component, inject, signal } from '@angular/core';
import { PermissionsService } from 'src/app/service/permissions-service';
import { InputSearchForm } from "../../elements/inputs/input-search-form/input-search-form";
import { ButtonMainForm } from "../../elements/buttons/button-main-form/button-main-form";
import { ButtonSecundaryForm } from "../../elements/buttons/button-secundary-form/button-secundary-form";
import { LabelForm } from "../../elements/labels/label-form/label-form";
import { InputForm } from "../../elements/inputs/input-form/input-form";
import { SelectorForm } from "../../elements/selectors/selector-form/selector-form";
import { ProductSendData,ProductTableRow } from 'src/app/interfaces/products-interfaces';
import { SelectorOption } from 'src/app/interfaces/forms';
import { TableForm } from "../../elements/tables/table-form/table-form";
import { ContentLabelTable, RowActionEvent } from 'src/app/interfaces/forms';
import { CategoriaService } from 'src/app/service/categoria-service';
import { ProductosService } from 'src/app/service/productos-service';
import { ToastService } from 'src/app/service/toast-service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleSwitch } from "../../elements/toggle-switch/toggle-switch";
import { statusRequest } from 'src/app/interfaces/request';




@Component({
  selector: 'app-productos',
  imports: [InputSearchForm, ButtonMainForm, ButtonSecundaryForm,
    LabelForm, InputForm, SelectorForm, TableForm, ReactiveFormsModule, ToggleSwitch],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent {

  //Services

  categoriaService = inject(CategoriaService);
  permissionns = inject(PermissionsService);
  productosService = inject(ProductosService);
  toastService = inject(ToastService);
  confirmDialogService = inject(ConfirmDialogService);

  //Signals

  options = signal<SelectorOption[]>([]);
  allProducts = signal<ProductTableRow[]>([]);
  tableContent = signal<ProductTableRow[]>([]);
  searchTerm = signal('');

  showDeleted = signal(false);

  lblBtn2 = signal<string>('Eliminar');
  iconBtn2 = signal<string>('delete');
  colorBtn2 = signal<string>('text-red-500');

  //forms
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    idCategory: new FormControl<number | null>(null, Validators.required)
  });  

  isFormValid = signal(false);

  id = signal(0);
  name = signal('');
  price = signal(0);
  code = signal('');
  description = signal('');
  idCategory = signal<number | null>(null);

  nameError = signal('');
  codeError = signal('');
  descriptionError = signal('');
  priceError = signal('');
  categoryError = signal('');

  modeForm = signal<string>('create');

  errorEstatus = signal(true);

  
  showCreateSection = signal(false);
 
  
  readonly test = signal('test');

  productName: ContentLabelTable[] = [
    { id: 1, name: 'Nombre', key: 'nombre' },
    { id: 2, name: 'Categoria', key: 'categoria' },
    { id: 3, name: 'Precio', key: 'precio' },
    { id: 4, name: 'Codigo', key: 'codigo' },
    { id: 5, name: 'Descripcion', key: 'descripcion' },
    { id: 6, name: 'Acciones', key: 'actions' }
  ];

  


  constructor() {
    this.getCategories();
    this.getProducts();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.applySearchFilter();
  }

  onShowDeletedChange(value: boolean): void {
    this.showDeleted.set(value);

    this.lblBtn2.set(value ? 'Reactivar' : 'Eliminar');
    this.iconBtn2.set(value ? 'refresh' : 'delete');
    this.colorBtn2.set(value ? 'text-green-500' : 'text-red-500');
    this.getProducts();
  }


  onNameChange(value: string | number): void {
    const parsedValue = String(value);
    this.name.set(parsedValue);
    this.form.controls.name.setValue(parsedValue);
    this.form.controls.name.markAsTouched();
    
  }

  onPriceChange(value: string | number): void {
    const numericValue = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
    this.price.set(numericValue);
    this.form.controls.price.setValue(Number.isFinite(numericValue) ? numericValue : 0);
    this.form.controls.price.markAsTouched();
    
  }

  onCodeChange(value: string | number): void {
    const parsedValue = String(value);
    this.code.set(parsedValue);
    this.form.controls.code.setValue(parsedValue);
    this.form.controls.code.markAsTouched();
    
  }

  onDescriptionChange(value: string | number): void {
    const parsedValue = String(value);
    this.description.set(parsedValue);
    this.form.controls.description.setValue(parsedValue);
    this.form.controls.description.markAsTouched();
    
  }

  onCategoryChange(value: number): void {
    const parsedValue = value > 0 ? value : null;
    this.idCategory.set(parsedValue);
    this.form.controls.idCategory.setValue(parsedValue);
    this.form.controls.idCategory.markAsTouched();
    
  }


 

  editProduct(event: RowActionEvent<ProductTableRow>): void {
    
    this.modeForm.set('edit');
    this.showCreateSection.set(true);

    this.onNameChange(event.row.nombre);
    this.onCodeChange(event.row.codigo);
    this.onDescriptionChange(event.row.descripcion);
    this.onPriceChange(event.row.precio);
    const matchedCategory = this.options().find(
      (option) => option.nombre.toLowerCase() === String(event.row.categoria).toLowerCase()
    );

    if (matchedCategory) {
      this.idCategory.set(Number(matchedCategory.id));
    } else {
      const categoryAsNumber = Number(event.row.categoria);
      this.idCategory.set(Number.isNaN(categoryAsNumber) ? null : categoryAsNumber);
    }

    this.form.patchValue({
      name: this.name(),
      code: this.code(),
      description: this.description(),
      price: this.price(),
      idCategory: this.idCategory(),
    });
    this.form.markAsUntouched();
    
    this.id.set(Number(event.id));

    console.log('Edit product with ID:', event.id);
    console.log('Product details:', event.row);
  }

  async saveProduct(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
   

    const productData: ProductSendData = {
      nombre: this.name(),
      codigo: this.code(),
      categoria_id: this.idCategory(),
      descripcion: this.description(),
      precio: this.price(),
      user_id: localStorage.getItem('id_user') ? Number(localStorage.getItem('id_user')) : 0 // Replace with actual user ID
    };

    

    if (this.modeForm() === 'edit') {

      const confirmed = await this.confirmDialogService.confirm({
      title: this.modeForm() === 'edit' ? 'Editar producto' : 'Registrar producto',
      message: this.modeForm() === 'edit' ? `Se editara el producto ${productData.nombre}. Esta accion no se puede deshacer.` : `Se registrara el producto ${productData.nombre}. Desea continuar?`,
      confirmLabel: this.modeForm() === 'edit' ? 'Editar' : 'Registrar',
      cancelLabel: 'Cancelar',
      destructive: this.modeForm() === 'edit',
      closeOnBackdrop: true,
    });

    if (!confirmed) {
      return;
    }


      this.productosService.editProduct(productData, this.id()).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Producto editado con éxito');
          
          this.cancelSave();

          this.getProducts();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al editar el producto', error.message);
          
        }
      });
    } else {


      const confirmed = await this.confirmDialogService.confirm({
      title: this.modeForm() === 'guardar' ? 'Guardar producto' : 'Registrar producto',
      message: this.modeForm() === 'guardar' ? `Se guardara el producto ${productData.nombre}. Esta accion no se puede deshacer.` : `Se registrara el producto ${productData.nombre}. Desea continuar?`,
      confirmLabel: this.modeForm() === 'guardar' ? 'Guardar' : 'Registrar',
      cancelLabel: 'Cancelar',
      destructive: this.modeForm() === 'guardar',
      closeOnBackdrop: true,
    });

    if (!confirmed) {
      return;
    }
      
    this.productosService.saveProduct(productData).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Producto regfistrado con éxito');
        console.log('Product saved successfully:', response);
        this.cancelSave();
        this.getProducts();
      },
      error: (error) => {
        console.error('Error saving product:', error);

        this.toastService.showErrorToast('Error al registrar el producto', error.message);
      }
    });
    
    
    }

    
  }


  cancelSave(): void {
    
    this.modeForm.set('create');
    this.name.set('');
    this.price.set(0);
    this.code.set('');
    this.description.set('');
    this.idCategory.set(null);
    this.form.reset({
      name: '',
      price: 0,
      code: '',
      description: '',
      idCategory: null,
    });
    this.clearValidationErrors();
    this.showCreateSection.set(false);
    
  }

  

  private clearValidationErrors(): void {
    this.nameError.set('');
    this.codeError.set('');
    this.descriptionError.set('');
    this.priceError.set('');
    this.categoryError.set('');
  }
  
  getCategories(): void {
    const estado: statusRequest  ={
      estado: 'ACT'
    }
    this.categoriaService.getCategorias(estado).subscribe({
      next: (categories) => {
        console.log('Fetched categories:', categories);
        this.options.set(categories.map(category => ({ id: category.id, nombre: category.nombre })));
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  } 
  

  getProducts(): void {

    const estado: statusRequest = {
      estado: this.showDeleted() ? 'INA' : 'ACT'
    };
    this.productosService.getProducts(estado).subscribe({
      next: (products ) => {
        this.allProducts.set(
          products.map((product) => ({
            ...product,
            precio: Number(product.inventario?.[0]?.precio ?? 0),
          }))
        );
        this.applySearchFilter();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al obtener los productos',error.message);
      }
    });
  }

  private applySearchFilter(): void {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      this.tableContent.set(this.allProducts());
      return;
    }

    const filtered = this.allProducts().filter((product) => {
      return (
        product.nombre.toLowerCase().includes(term) ||
        product.codigo.toLowerCase().includes(term) ||
        product.precio.toString().toLowerCase().includes(term) ||
        product.descripcion.toLowerCase().includes(term) ||
        product.categoria.toLowerCase().includes(term)
      );
    });

    this.tableContent.set(filtered);
  }

  async requestDeleteProduct(event: RowActionEvent<ProductTableRow>): Promise<void> {
    if(this.showDeleted()){
      const confirmed = await this.confirmDialogService.confirm({
        title: 'Reactivar producto',
        message: `¿Desea reactivar el producto ${event.row.nombre}?`,
        confirmLabel: 'Reactivar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true,
      });
  
      if (!confirmed) {
        return;
      }

      this.productosService.reactivateProduct(event.row.id).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Producto reactivado con éxito');
          this.getProducts();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al reactivar el producto', error.message);
        }
      });
    }else{
      const confirmed = await this.confirmDialogService.confirm({
        title: 'Eliminar producto',
        message: `¿Desea eliminar el producto ${event.row.nombre}? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true,
      });
  
      if (!confirmed) {
        return;
      }

      this.productosService.deleteProduct(event.row.id).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Producto eliminado con éxito');
          this.getProducts();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al eliminar el producto', error.message);
        }
      });
    }   
  }




  

  

}
