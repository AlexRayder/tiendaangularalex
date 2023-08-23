import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductoService } from 'src/app/servicios/producto.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  public listaProductos: any;
  public listaCategorias: any;
  display = 'none';
  idProducto: any;
  url: any;
  public selectedFoto: File | undefined;

  // Nuevas propiedades para la funcionalidad de edición
  editDisplay = 'none';
  editedProducto: any = {};

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) {
    this.url = "https://alexxoo.pythonanywhere.com/media/fotos";
  }

  obtenerProductos() {
    this.productoService.getProductos().subscribe((result) => {
      this.listaProductos = result;
    });
  }

  listarCategorias() {
    this.categoriaService.listarCategorias().subscribe(
      (data) => {
        console.log(data);
        this.listaCategorias = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cerrarModal() {
    this.display = 'none';
  }

  abrirModalEliminar(codigo: number) {
    this.display = 'block';
    this.idProducto = codigo;
  }

  eliminarProducto() {
    this.productoService.eliminarProducto(this.idProducto).subscribe(
      (result) => {
        this.router.navigate(['/', 'productos']);
      },
      (error) => {
        console.log(error);
      }
    );
    this.display = 'none';
  }

  openEditModal(producto: any) {
    this.editedProducto = { ...producto };
    this.editedProducto.id = producto.proCodigo; // Agregar esta línea para asignar el id
    this.editDisplay = 'block';
  }

  onFileSelect(event: any) {
    this.selectedFoto = event.target.files[0];
    if (this.selectedFoto) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editedProducto.proFoto = e.target.result; // Contenido de la imagen en base64
      };
      reader.readAsDataURL(this.selectedFoto); // Lee el contenido de la imagen como base64
    }
  }
  // Nuevo método para cerrar el modal de edición
  cerrarEditarModal() {
    this.editDisplay = 'none';
    this.selectedFoto = undefined; // Limpiar la foto seleccionada cuando se cierra el modal
  }

  submitEditForm() {
    const formData = new FormData();
    formData.append('proCodigo', this.editedProducto.proCodigo.toString());
    formData.append('proNombre', this.editedProducto.proNombre);
    formData.append('proPrecio', this.editedProducto.proPrecio.toString());
    formData.append('proCategoria', this.editedProducto.proCategoria.toString());
    
    // Update the product code in editedProducto
    this.editedProducto.proCodigo = this.editedProducto.id;
    
    // Check if a new photo is selected
    if (this.selectedFoto) {
      formData.append('proFoto', this.selectedFoto, this.selectedFoto.name);
    }
    
    this.productoService.actualizarProducto(this.editedProducto.id, formData).subscribe(
      (result) => {
        this.obtenerProductos();
        this.cerrarEditarModal();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  

  ngOnInit(): void {
    this.listarCategorias();
    this.obtenerProductos();
  }
}
