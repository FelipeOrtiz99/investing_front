import { Component, OnInit } from '@angular/core';
import { Transaction } from '../domain/transaction';
import { TransactionService } from '../service/transactionservice';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-formlayout-demo',
    standalone: true,
    imports: [TableModule, TagModule],
    template: `<div class="card">
            <p-table [value]="transaction" [tableStyle]="{ 'min-width': '50rem' }">
    <ng-template #header>
        <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Client</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>Wallet Id</th>
            <th>Investment Fund</th>
            <th> Description </th>
            <th>State</th>
        </tr>
    </ng-template>
    <ng-template #body let-transaction>
        <tr>
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.clientName }}</td>
            <td>{{ transaction.currencyCode }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.walletId }}</td>
            <td>{{ transaction.investmentFundName }}</td>
            <td>{{ transaction.description }}</td>
            <td>
            <p-tag [value]="getStatus(transaction.status)" [severity]="transaction.status ? 'success' : 'danger'"></p-tag>
            </td>
        </tr>
    </ng-template>
</p-table>
        </div>`,
    providers: [TransactionService]
})
export class TransactionsTable implements OnInit {

    constructor(private transactionService: TransactionService) {}

    ngOnInit() {
        this.transactionService.getTransactions().subscribe((data) => {
            this.transaction = data;
        });
    }

    transaction!: Transaction[];
    

    getStatus(transaction: boolean): string {
        return transaction ? 'Active' : 'Canceled';
    }

}
