import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Transaction, createInvestment } from '../domain/transaction';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  
  private baseUrl = environment.apiBaseUrl.transactions;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl).pipe(
      timeout(10000), // 10 segundos timeout
      catchError(error => this.handleError(error, 'getTransactions'))
    );
  }

  getTransactionsActive(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/active`).pipe(
      timeout(10000),
      catchError(error => this.handleError(error, 'getTransactionsActive'))
    );
  }

  UnsubscribeFromFund(idTransaccion: string): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/${idTransaccion}/unsubscribe`, {}).pipe(
      timeout(10000),
      catchError(error => this.handleError(error, 'unsubscribeFromFund'))
    );
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`).pipe(
      timeout(10000),
      catchError(error => this.handleError(error, 'getTransaction'))
    );
  }

  getTransactionsByClient(clientId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/client/${clientId}`).pipe(
      timeout(10000),
      catchError(error => this.handleError(error, 'getTransactionsByClient'))
    );
  }

  createTransaction(data: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, data).pipe(
      timeout(15000), // Más tiempo para operaciones de escritura
      catchError(error => this.handleError(error, 'createTransaction'))
    );
  }

  updateTransaction(id: string, data: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, data).pipe(
      timeout(15000),
      catchError(error => this.handleError(error, 'updateTransaction'))
    );
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      timeout(15000),
      catchError(error => this.handleError(error, 'deleteTransaction'))
    );
  }

  createInvestment(investmentData: createInvestment): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/investment`, investmentData).pipe(
      timeout(15000),
      catchError(error => this.handleError(error, 'createInvestment'))
    );
  }

  // 🔥 Método centralizado para manejo de errores
  private handleError(error: HttpErrorResponse, operation: string): Observable<never> {
    // Log del error con contexto
    this.errorHandler.logError(error, `TransactionService.${operation}`);
    
    // Retornar el error para que el componente pueda manejarlo
    return throwError(error);
  }
}
