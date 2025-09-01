import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ApiStatus {
  isOnline: boolean;
  lastChecked: Date;
  retryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  private apiStatusSubject = new BehaviorSubject<ApiStatus>({
    isOnline: true,
    lastChecked: new Date(),
    retryCount: 0
  });

  public apiStatus$ = this.apiStatusSubject.asObservable();

  // 🔥 Estados de error comunes
  private commonErrors = {
    NETWORK_ERROR: 'Network connection failed. Please check your internet.',
    SERVER_ERROR: 'Server is temporarily unavailable. Please try again later.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'You need to log in to access this resource.',
    FORBIDDEN: 'You don\'t have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.'
  };

  constructor() {
    // 🔥 Verificar estado de API cada 30 segundos si está offline
    this.startApiHealthCheck();
  }

  // 🔥 Actualizar estado de la API
  setApiStatus(isOnline: boolean) {
    const currentStatus = this.apiStatusSubject.value;
    
    this.apiStatusSubject.next({
      isOnline,
      lastChecked: new Date(),
      retryCount: isOnline ? 0 : currentStatus.retryCount + 1
    });

    if (!isOnline) {
      console.warn('🔴 API is OFFLINE');
    } else {
      console.log('🟢 API is ONLINE');
    }
  }

  // 🔥 Obtener estado actual de la API
  getApiStatus(): ApiStatus {
    return this.apiStatusSubject.value;
  }

  // 🔥 Verificación periódica de salud de la API
  private startApiHealthCheck() {
    // Implementar ping cada 30 segundos si está offline
    this.apiStatus$.subscribe(status => {
      if (!status.isOnline) {
        setTimeout(() => {
          this.checkApiHealth();
        }, 30000);
      }
    });
  }

  // 🔥 Hacer ping a la API para verificar si volvió
  private async checkApiHealth() {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        timeout: 5000 
      } as any);
      
      if (response.ok) {
        this.setApiStatus(true);
      }
    } catch (error) {
      console.log('API still offline');
    }
  }

  // 🔥 Obtener mensaje de error amigable
  getErrorMessage(errorCode: string): string {
    return this.commonErrors[errorCode as keyof typeof this.commonErrors] || 
           'An unexpected error occurred. Please try again.';
  }

  // 🔥 Mostrar modal de error offline
  showOfflineModal(): void {
    // Esto se puede implementar con un servicio de modal
    console.log('🔴 Showing offline modal');
  }

  // 🔥 Logger de errores para debugging
  logError(error: any, context?: string) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context: context || 'Unknown',
      error: error,
      apiStatus: this.getApiStatus(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('🔥 Error Log:', errorInfo);
    
    // Aquí podrías enviar a un servicio de logging externo como Sentry
    // this.sendToExternalLogger(errorInfo);
  }
}
