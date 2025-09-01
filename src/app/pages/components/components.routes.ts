import { Routes } from '@angular/router';
import { TransactionsTable } from './transactionsTable';
import { InvestmentFundsForm } from './investmentFundsForm';
import { activeTransactionsTable } from './activeTransactionsTable';


export default [
    { path: 'formlayout', data: { breadcrumb: 'Transactions' }, component: TransactionsTable },
    { path: 'input', data: { breadcrumb: 'Investment Funds' }, component: InvestmentFundsForm },
    { path: 'table', data: { breadcrumb: 'Active Transactions' }, component: activeTransactionsTable },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
