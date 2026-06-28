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




@Component({
  selector: 'app-productos',
  imports: [InputSearchForm, ButtonMainForm, ButtonSecundaryForm,
     LabelForm, InputForm, SelectorForm, TableForm],
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
  tableContent = signal<ProductTableRow[]>([]);


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
    { id: 4, name: 'Codigo', key: 'codigo' },
    { id: 5, name: 'Descripcion', key: 'descripcion' },
    { id: 6, name: 'Acciones', key: 'actions' }
  ];

  


  constructor() {
    this.getCategories();
    this.getProducts();
  }



  onNameChange(value: string | number): void {
    this.name.set(String(value));
    this.validateName();
  }

  onPriceChange(value: string | number): void {
    const numericValue = typeof value === 'number' ? value : Number(value);
    this.price.set(numericValue);
    this.validatePrice();
  }

  onCodeChange(value: string | number): void {
    this.code.set(String(value));
    this.validateCode();
  }

  onDescriptionChange(value: string | number): void {
    this.description.set(String(value));
    this.validateDescription();
  }

  onCategoryChange(value: number): void {
    this.idCategory.set(value > 0 ? value : null);
    this.validateCategory();
  }


 

  editProduct(event: RowActionEvent<ProductTableRow>): void {
    
    this.modeForm.set('edit');
    this.showCreateSection.set(true);

    this.onNameChange(event.row.nombre);
    this.onCodeChange(event.row.codigo);
    this.onDescriptionChange(event.row.descripcion);
    const matchedCategory = this.options().find(
      (option) => option.nombre.toLowerCase() === String(event.row.categoria).toLowerCase()
    );

    if (matchedCategory) {
      this.idCategory.set(Number(matchedCategory.id));
    } else {
      const categoryAsNumber = Number(event.row.categoria);
      this.idCategory.set(Number.isNaN(categoryAsNumber) ? null : categoryAsNumber);
    }
    
    this.id.set(Number(event.id));

    console.log('Edit product with ID:', event.id);
    console.log('Product details:', event.row);
  }

  async saveProduct(): Promise<void> {
    if (!this.validateForm()) {
      this.toastService.showErrorToast('Campos obligatorios', 'Completa todos los campos requeridos.');
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
    this.clearValidationErrors();
    this.showCreateSection.set(false);
    
  }

  private validateName(): boolean {
    const valid = this.name().trim().length > 0;
    this.nameError.set(valid ? '' : 'El nombre es obligatorio.');
    return valid;
  }

  private validateCode(): boolean {
    const valid = this.code().trim().length > 0;
    this.codeError.set(valid ? '' : 'El codigo es obligatorio.');
    return valid;
  }

  private validateDescription(): boolean {
    const valid = this.description().trim().length > 0;
    this.descriptionError.set(valid ? '' : 'La descripcion es obligatoria.');
    return valid;
  }

  private validatePrice(): boolean {
    const valid = Number.isFinite(this.price()) && this.price() > 0;
    this.priceError.set(valid ? '' : 'El precio debe ser mayor que cero.');
    return valid;
  }

  private validateCategory(): boolean {
    const selectedCategory = this.idCategory();
    const valid = selectedCategory !== null && selectedCategory > 0;
    this.categoryError.set(valid ? '' : 'Selecciona una categoria.');
    return valid;
  }

  private validateForm(): boolean {
    const validName = this.validateName();
    const validCode = this.validateCode();
    const validDescription = this.validateDescription();
    const validPrice = this.validatePrice();
    const validCategory = this.validateCategory();

    return validName && validCode && validDescription && validPrice && validCategory;
  }

  private clearValidationErrors(): void {
    this.nameError.set('');
    this.codeError.set('');
    this.descriptionError.set('');
    this.priceError.set('');
    this.categoryError.set('');
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
  

  getProducts(): void {
    this.productosService.getProducts().subscribe({
      next: (products ) => {
        this.tableContent.set(products);
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al obtener los productos',error.message);
      }
    });
  }

  async requestDeleteProduct(event: RowActionEvent<ProductTableRow>): Promise<void> {
    const id = Number(event.id);

    if (Number.isNaN(id) || id <= 0) {
      this.toastService.showErrorToast('Error al eliminar el producto', 'ID de producto invalido.');
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({
      title: 'Eliminar producto',
      message: `Se eliminara el producto ${event.row.nombre}. Esta accion no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true,
    });

    if (!confirmed) {
      return;
    }

    this.productosService.deleteProduct(id).subscribe({
      next: () => {
        this.toastService.showSuccessToast('Producto eliminado con exito');
        this.getProducts();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al eliminar el producto', error.message);
      },
    });
  }




  

}
