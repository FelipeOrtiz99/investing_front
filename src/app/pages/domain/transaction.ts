export interface Transaction {
    id: string;
    date: string;
    clientName: string;
    currencyCode: string;
    amount: number;
    status: boolean;
    walletId: string;
    investmentFundName: string;
    description: string;
}

export interface createInvestment {
    clientId: string;
    currencyId: string;
    amount: number;
    investmentFundId: string;
    description: string;
}