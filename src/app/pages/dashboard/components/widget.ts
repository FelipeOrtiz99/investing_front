import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientContextService } from '@/pages/service/client-context.service';
import { TransactionEventsService } from '@/pages/service/transaction-events.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Client } from '@/pages/domain/client';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, SkeletonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div *ngIf="currentClient">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Welcome back 👋 {{currentClient.name}} </span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalBalance | currency }} COP</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 text-xl!"></i>
                    </div>
                </div>
            </div>
            <div *ngIf="!currentClient">
                <p-skeleton width="10rem" height="8rem" />
            </div>
        </div>`
})
export class StatsWidget implements OnInit, OnDestroy {

    currentClient: Client | null = null;
    totalBalance: number = 0;
    private subscription!: Subscription;
    private balanceSubscription!: Subscription;

    constructor(
        private clientContextService: ClientContextService,
        private transactionEventsService: TransactionEventsService
    ) {}

      ngOnInit() {
    // 🔥 Suscribirse al cliente actual
    this.subscription = this.clientContextService.currentClient$.subscribe(client => {
      this.currentClient = client;
      // 🔥 Calcular balance desde los wallets del cliente
      this.calculateTotalBalance();
      console.log('Cliente en StatsWidget:', client);
    });

    // 🔥 Suscribirse a cambios en el balance por transacciones
    this.balanceSubscription = this.transactionEventsService.balanceChanged$.subscribe(() => {
      console.log('🔥 StatsWidget: Evento balanceChanged recibido');
      this.reloadClientData();
    });
  }

  ngOnDestroy() {
    // 🔥 Limpiar las suscripciones
    this.subscription.unsubscribe();
    this.balanceSubscription.unsubscribe();
  }

  private calculateTotalBalance() {
    if (this.currentClient?.wallet) {
      this.totalBalance = this.currentClient.wallet.reduce(
        (total, wallet) => total + wallet.balance, 
        0
      );
    } else {
      this.totalBalance = 0;
    }
  }

  // 🔥 Método para recargar datos del cliente desde el servidor
  private reloadClientData() {
    console.log('🔥 StatsWidget: reloadClientData called');
    if (this.currentClient?.id) {
      // 🔥 Recargar el cliente completo desde el servidor
      this.clientContextService.reloadCurrentClient();
      // Nota: El balance se actualizará automáticamente cuando llegue el cliente actualizado
      // a través de la suscripción currentClient$ en ngOnInit
    }
  }

  get clientName(): string {
    return this.currentClient?.name || 'Sin cliente';
  }

  get walletsCount(): number {
    return this.currentClient?.wallet?.length || 0;
  }

  get hasWallets(): boolean {
    return this.walletsCount > 0;
  }

}
