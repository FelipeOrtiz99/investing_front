import { Component } from '@angular/core';
import { StatsWidget } from './components/widget';
import { activeTransactionsTable } from "../components/activeTransactionsTable";
import { InvestmentFundsForm } from "../components/investmentFundsForm";


@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, activeTransactionsTable, InvestmentFundsForm],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-12">
                <app-input-demo/>
            </div>
            <div class="col-span-12 xl:col-span-12">
                <app-table-demo />
            </div>
        </div>
    `
})
export class Dashboard {}
