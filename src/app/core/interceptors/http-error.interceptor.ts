import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, retryWhen, delayWhen, take } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  
  constructor(
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // 🔥 Retry automático para errores de red
      retryWhen(errors => 
        errors.pipe(
          delayWhen((error: HttpErrorResponse) => {
            // Solo retry para errores de red (0, 500, 502, 503, 504)
            if (this.shouldRetry(error)) {
              console.log(`Retrying request to ${req.url} in 2 seconds...`);
              return timer(2000);
            }
            return throwError(error);
          }),
          take(3) // Máximo 3 reintentos
        )
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        
        // 🔥 Manejar diferentes tipos de errores
        this.handleHttpError(error, req.url);
        
        return throwError(error);
      })
    );
  }

  private shouldRetry(error: HttpErrorResponse): boolean {
    // Retry para errores de conexión y errores del servidor
    return error.status === 0 || // Sin conexión
           error.status === 500 || // Error interno del servidor
           error.status === 502 || // Bad Gateway
           error.status === 503 || // Service Unavailable
           error.status === 504;   // Gateway Timeout
  }

  private handleHttpError(error: HttpErrorResponse, url: string) {
    let errorMessage = '';
    let severity: 'error' | 'warn' | 'info' = 'error';

    if (error.status === 0) {
      // 🔥 Error de conexión - API caída
      errorMessage = 'Cannot connect to server. Please check your internet connection.';
      severity = 'error';
      this.errorHandlerService.setApiStatus(false);
    } else if (error.status >= 500) {
      // 🔥 Error del servidor
      errorMessage = 'Server error occurred. Please try again later.';
      severity = 'error';
      this.errorHandlerService.setApiStatus(false);
    } else if (error.status === 404) {
      errorMessage = 'Requested resource not found.';
      severity = 'warn';
    } else if (error.status === 401) {
      errorMessage = 'You are not authorized to access this resource.';
      severity = 'warn';
    } else if (error.status === 403) {
      errorMessage = 'Access forbidden.';
      severity = 'warn';
    } else {
      errorMessage = `HTTP Error ${error.status}: ${error.message}`;
      severity = 'error';
    }

    // 🔥 Mostrar notificación al usuario
    this.messageService.add({
      severity: severity,
      summary: 'Connection Error',
      detail: errorMessage,
      life: 5000
    });
  }
}
