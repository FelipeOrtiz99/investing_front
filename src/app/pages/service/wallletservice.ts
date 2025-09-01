import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../domain/wallet';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:7165/api/Wallets/'; // << tu API externa

  constructor(private http: HttpClient) {}

  // Obtener lista de posts
  getPosts(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.baseUrl}/posts`);
  }

  getWallets(idClient: string): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.baseUrl}/client/${idClient}`);
  }

  // Obtener un post por ID
  getPost(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.baseUrl}/posts/${id}`);
  }

  // Crear un post
  createPost(data: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.baseUrl}/posts`, data);
  }

  // Actualizar un post
  updatePost(id: number, data: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.baseUrl}/posts/${id}`, data);
  }

  // Eliminar un post
  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/posts/${id}`);
  }
}
