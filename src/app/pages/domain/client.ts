import { Wallet } from './wallet';

export interface Client {
    id: string;
    name: string;
    state: boolean;
    wallet?: Wallet[];
}