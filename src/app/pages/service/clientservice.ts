import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Client } from '@/pages/domain/client';
import { Wallet } from '../domain/wallet';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = environment.apiBaseUrl.clients;
  

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}`);
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  getClienthardcoded(id: string): Observable<Client> {
    const HARDCODED_CLIENT_ID = 'b566ce17-e534-4ef0-aa0d-4e3302a0a584';
    return forkJoin({
      client: this.http.get<Client>(`${this.baseUrl}/${HARDCODED_CLIENT_ID}`),
      wallets: this.http.get<Wallet[]>(`https://localhost:7165/api/Wallets/client/${HARDCODED_CLIENT_ID}`)
    }).pipe(
      map(({ client, wallets }) => ({
        ...client,
        wallet: wallets
      }))
    );
  }
  
  createClient(data: Client): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}`, data);
  }

  updateClient(id: string, data: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, data);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
