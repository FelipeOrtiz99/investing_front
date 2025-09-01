import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Transaction } from '../domain/transaction';
import { TransactionService } from '../service/transactionservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionEventsService } from '../service/transaction-events.service';
import { Subscription } from 'rxjs';



@Component({
    selector: 'app-table-demo',
    standalone: true,
    imports: [
        TableModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        IconFieldModule,
        ConfirmDialogModule,
        ToastModule
    ],
    template: ` 
    <p-toast/>
    <p-confirmDialog/>
    <div class="card">
            <p-table 
                [value]="transactionsActive" 
                [tableStyle]="{ 'min-width': '50rem' }"
                dataKey="id">
    <ng-template #header>
        <tr>
            <th>Id Transaction</th>
            <th>Fund Name</th>
            <th>Amount</th>
            <th>CurrencyCode</th>
            <th>Action</th>
        </tr>
    </ng-template>
    <ng-template #body let-transaction let-i="rowIndex">
        <tr>
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.investmentFundName }}</td>
            <td>{{ transaction.amount | currency:'COP':'symbol':'1.0-0' }}</td>
            <td>{{ transaction.currencyCode }}</td>
            <td>
                <p-button 
                    icon="pi pi-times" 
                    (click)="deleteTransaction($event, transaction)" 
                    severity="primary" 
                    rounded 
                    size="small" />
            </td>
        </tr>
    </ng-template>
</p-table>
        </div>
        `,
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [TransactionService, ConfirmationService, MessageService]
})



export class activeTransactionsTable implements OnInit, OnDestroy {

    transactionsActive!: Transaction[];
    private fullTransactionsData!: Transaction[];
    private balanceSubscription!: Subscription; // 🔥 Nueva suscripción 

    constructor(
        private transactionService: TransactionService, 
        private confirmationService: ConfirmationService, 
        private messageService: MessageService,
        private transactionEventsService: TransactionEventsService
    ) {}

    ngOnInit() {
        this.loadTransactions();
        
        // 🔥 Suscribirse a cambios de transacciones para recargar la tabla
        this.balanceSubscription = this.transactionEventsService.balanceChanged$.subscribe(() => {
            console.log('🔥 activeTransactionsTable: Evento balanceChanged recibido - Recargando tabla');
            this.loadTransactions();
        });
    }

    ngOnDestroy() {
        // 🔥 Limpiar la suscripción
        if (this.balanceSubscription) {
            this.balanceSubscription.unsubscribe();
        }
    }

    // 🔥 Método para cargar transacciones
    private loadTransactions() {
        this.transactionService.getTransactionsActive().subscribe((data) => {
            this.transactionsActive = data;
            this.fullTransactionsData = [...data];
        });
    }

    deleteTransaction(event: Event, transaction: Transaction) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to suspend this transaction?',
            header: 'Suspend Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Unsubscribe',
                severity: 'danger'
            },
            accept: () => {
                this.updateTransactionStatus(transaction, false);
            },
        });
    }

    updateTransaction(transactionId: string, updates: Partial<Transaction>) {
        const fullTransaction = this.fullTransactionsData.find(t => t.id === transactionId);
        if (fullTransaction) {
            const updatedTransaction: Transaction = {
                ...fullTransaction,
                ...updates
            };

            this.transactionService.UnsubscribeFromFund(transactionId)
                .subscribe({
                    next: (result) => {
                        // 🔥 SOLUCIÓN SIMPLE: Recargar todos los datos desde el servidor
                        this.loadTransactions();
                        
                        // 🔥 Notificar evento
                        this.transactionEventsService.notifyTransactionUpdated(transactionId);
                        
                        this.messageService.add({ 
                            severity: 'success', 
                            summary: 'Updated', 
                            detail: 'Transaction updated successfully' 
                        });
                    },
                    error: (error) => {
                        console.error('Error updating transaction:', error);
                        this.messageService.add({ 
                            severity: 'error', 
                            summary: 'Error', 
                            detail: 'Failed to update transaction' 
                        });
                    }
                });
        } else {
            console.error('Transaction not found in full data:', transactionId);
        }
    }


    updateTransactionStatus(transaction: Transaction, newStatus: boolean) {
        this.updateTransaction(transaction.id, { status: newStatus });
    }

    
}
