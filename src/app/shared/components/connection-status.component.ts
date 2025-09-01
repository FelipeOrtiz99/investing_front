import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorHandlerService, ApiStatus } from '../../core/services/error-handler.service';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule, MessageModule, ButtonModule],
  template: `
    <!-- 🔥 Banner de estado offline -->
    <div *ngIf="!apiStatus.isOnline" 
         class="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white p-3 text-center shadow-lg">
      <div class="flex items-center justify-center gap-4">
        <i class="pi pi-exclamation-triangle"></i>
        <span>
          <strong>Connection Lost:</strong> Unable to connect to server. 
          Retrying... (Attempt {{ apiStatus.retryCount }})
        </span>
        <button 
          pButton 
          type="button" 
          label="Retry Now" 
          size="small"
          severity="secondary"
          (click)="retryConnection()"
          class="text-xs">
        </button>
      </div>
    </div>

    <!-- 🔥 Banner de reconexión exitosa -->
    <div *ngIf="showReconnectedMessage" 
         class="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white p-3 text-center shadow-lg">
      <div class="flex items-center justify-center gap-2">
        <i class="pi pi-check-circle"></i>
        <span><strong>Reconnected!</strong> Connection restored successfully.</span>
      </div>
    </div>
  `,
  styles: [`
    .fixed {
      animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `]
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  
  apiStatus: ApiStatus = {
    isOnline: true,
    lastChecked: new Date(),
    retryCount: 0
  };

  showReconnectedMessage = false;
  private subscription!: Subscription;
  private wasOffline = false;

  constructor(private errorHandlerService: ErrorHandlerService) {}

  ngOnInit() {
    // 🔥 Suscribirse a cambios en el estado de la API
    this.subscription = this.errorHandlerService.apiStatus$.subscribe(status => {
      const previousStatus = this.apiStatus.isOnline;
      this.apiStatus = status;

      // 🔥 Mostrar mensaje de reconexión
      if (!previousStatus && status.isOnline && this.wasOffline) {
        this.showReconnectedMessage = true;
        setTimeout(() => {
          this.showReconnectedMessage = false;
        }, 3000);
      }

      this.wasOffline = !status.isOnline;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  retryConnection() {
    // 🔥 Forzar verificación de conexión
    window.location.reload();
  }
}
