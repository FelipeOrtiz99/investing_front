import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InvestmentFund } from '../domain/investmentfund';
import { InvestmentFundService } from '../service/investmentfund';
import { TransactionService } from '../service/transactionservice';
import { TransactionEventsService } from '../service/transaction-events.service';
import { ClientContextService } from '../service/client-context.service';
import { createInvestment } from '../domain/transaction';

@Component({
    selector: 'app-input-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        InputTextModule,
        ButtonModule,
        SelectButtonModule,
        InputGroupModule,
        FluidModule,
        IconFieldModule,
        InputIconModule,
        FloatLabelModule,
        InputNumberModule,
        SelectModule,
        ListboxModule,
        InputGroupAddonModule,
        TextareaModule,
        ToastModule
    ],
    template: ` 
        <p-toast/>
        <p-fluid class="flex mt-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Create Investment</div>
                <div class="flex flex-col md:flex-row gap-6">
                    <p-inputgroup>
                        <p-select 
                            [(ngModel)]="selectedInvestmentFund" 
                            [options]="InvestmentFunds" 
                            optionLabel="name" 
                            placeholder="Select Investment Fund" 
                            [showClear]="true"
                            (onChange)="onInvestmentFundChange()" />
                    </p-inputgroup>
                    <p-inputgroup>
                        <p-inputnumber 
                            [(ngModel)]="amount" 
                            placeholder="Amount" 
                            [min]="0"
                            [step]="100"
                            mode="currency" 
                            currency="USD" />
                        <p-inputgroup-addon>$</p-inputgroup-addon>
                    </p-inputgroup>
                    <p-inputgroup>
                        <p-button 
                            label="Create" 
                            (onClick)="createInvestment()" 
                            [disabled]="!selectedInvestmentFund || !amount" />
                    </p-inputgroup>
                </div>
            </div>
        </p-fluid>`,
    providers: [InvestmentFundService, MessageService, TransactionService]
})
export class InvestmentFundsForm implements OnInit {

    selectedInvestmentFund: InvestmentFund | null = null;
    amount: number | null = null;
    InvestmentFunds: InvestmentFund[] = [];

    constructor(
        private InvestmentFundService: InvestmentFundService,
        private messageService: MessageService,
        private transactionService: TransactionService,
        private transactionEventsService: TransactionEventsService,
        private clientContextService: ClientContextService
    ) {
        console.log('Initial selectedInvestmentFund:', this.selectedInvestmentFund);
    }

    ngOnInit() {
        this.InvestmentFundService.getInvestmentFunds().subscribe((data: InvestmentFund[]) => {
            this.InvestmentFunds = data;
            console.log('Investment Funds loaded:', this.InvestmentFunds);
        });
    }

    onInvestmentFundChange() {
        console.log('Selected Investment Fund changed:', this.selectedInvestmentFund);
    }

    createInvestment() {
        // Validar que se haya seleccionado un fondo y un monto
        if (!this.selectedInvestmentFund) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, selecciona un fondo de inversión'
            });
            return;
        }

        if (!this.amount || this.amount <= 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, ingresa un monto válido'
            });
            return;
        }

        // Validar que el monto sea mayor o igual al mínimo requerido
        if (this.amount < this.selectedInvestmentFund.minInvestment) {
            this.messageService.add({
                severity: 'error',
                summary: 'Monto insuficiente',
                detail: `Ingrese la cantidad correcta. El monto mínimo para ${this.selectedInvestmentFund.name} es $${this.selectedInvestmentFund.minInvestment}`
            });
            return;
        }

        const currentClient = this.clientContextService.getCurrentClient();

        console.log('Current Client:', currentClient);
        if (!currentClient) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo obtener la información del cliente'
            });
            return;
        }
        

        const investmentData: createInvestment = {
            clientId: currentClient.id,
            currencyId: "41c1723e-6fcd-4e38-a547-8b2ee21bac8f", 
            amount: this.amount,
            investmentFundId: this.selectedInvestmentFund.id,
            description: `Inversión en ${this.selectedInvestmentFund.name} por $${this.amount}`
        };

        console.log('Creating investment:', investmentData);

        // 🔥 Realizar la petición HTTP
        this.transactionService.createInvestment(investmentData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Inversión creada exitosamente en ${this.selectedInvestmentFund!.name} por $${this.amount}`
                });

                this.transactionEventsService.notifyTransactionUpdated(response.id || 'new-investment');
                this.selectedInvestmentFund = null;
                this.amount = null;

                console.log('Investment created successfully:', response);
            },
            error: (error) => {
                console.error('Error creating investment:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al crear la inversión. Por favor, intenta nuevamente.'
                });
            }
        });
    }


}
