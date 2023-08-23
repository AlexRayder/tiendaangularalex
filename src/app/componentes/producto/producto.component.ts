import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ProductoService } from 'src/app/servicios/producto.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  public frmProducto!: FormGroup;
  public mensaje: string = '';
  public listaCategorias: any;
  public selectedFoto: File | undefined;

  constructor(
    private location: Location,
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  listarCategorias() {
    this.categoriaService.listarCategorias().subscribe((result) => {
      this.listaCategorias = result;
    });
  }

  agregarProducto() {
    if (!this.frmProducto.valid) {
      this.mensaje = "Error en el formulario";
      return;
    }

    const formData = new FormData();
    formData.append('proCodigo', this.frmProducto.value.txtCodigo);
    formData.append('proNombre', this.frmProducto.value.txtNombre);
    formData.append('proPrecio', this.frmProducto.value.txtPrecio);
    formData.append('proCategoria', this.frmProducto.value.cbCategoria);

    if (this.selectedFoto) {
      formData.append('proFoto', this.selectedFoto, this.selectedFoto.name);
    }

    this.productoService.agregarProducto(formData).subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.mensaje = "Producto agregado correctamente";
        this.location.back();
      },
      (error) => {
        console.log(error);
        this.mensaje = "Error al agregar el producto";
      }
    );
  }

  onFileSelect(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.selectedFoto = selectedFile;
    }
  }

  ngOnInit(): void {
    this.listarCategorias();
    this.frmProducto = new FormGroup({
      txtCodigo: new FormControl('', [Validators.required]),
      txtNombre: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      txtPrecio: new FormControl('', [Validators.required]),
      cbCategoria: new FormControl('', [Validators.required]),
      fileFoto: new FormControl('', [Validators.required])
    });
  }
}
