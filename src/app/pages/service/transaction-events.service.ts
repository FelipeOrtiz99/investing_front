import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionEventsService {
  // 🔥 Evento cuando se actualiza una transacción
  private transactionUpdatedSource = new Subject<string>();
  transactionUpdated$ = this.transactionUpdatedSource.asObservable();

  // 🔥 Evento cuando se elimina una transacción
  private transactionDeletedSource = new Subject<string>();
  transactionDeleted$ = this.transactionDeletedSource.asObservable();

  // 🔥 Evento general para recalcular balances
  private balanceChangedSource = new Subject<void>();
  balanceChanged$ = this.balanceChangedSource.asObservable();

  // 🔥 Métodos para emitir eventos
  notifyTransactionUpdated(transactionId: string) {
    console.log('🔥 TransactionEventsService: notifyTransactionUpdated called with ID:', transactionId);
    this.transactionUpdatedSource.next(transactionId);
    this.notifyBalanceChanged();
  }

  notifyTransactionDeleted(transactionId: string) {
    console.log('🔥 TransactionEventsService: notifyTransactionDeleted called with ID:', transactionId);
    this.transactionDeletedSource.next(transactionId);
    this.notifyBalanceChanged();
  }

  notifyBalanceChanged() {
    console.log('🔥 TransactionEventsService: notifyBalanceChanged called');
    this.balanceChangedSource.next();
  }
}
