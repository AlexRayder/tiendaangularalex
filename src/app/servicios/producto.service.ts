import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/modelos/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url = "https://alexxoo.pythonanywhere.com/producto";

  constructor(private http: HttpClient) {}

  listarProducto(): Observable<any> {
    return this.http.get(this.url);
  }

  getProductos(): Observable<any> {
    return this.http.get(this.url);
  }

  getProducto(id: string): Observable<any> {
    return this.http.get(this.url + "/" + id);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(this.url + "/" + id);
  }

  agregarProducto(formData: FormData) {
    return this.http.post(this.url, formData);
  }

  actualizarProducto(id: string, formData: FormData): Observable<any> {
    return this.http.put(this.url + "/" + id, formData);
  }
}