import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Client } from "../domain/client";
import { ClientService } from "./clientservice";

// client-context.service.ts
@Injectable({ providedIn: 'root' })
export class ClientContextService {
  private currentClientSubject = new BehaviorSubject<Client | null>(null);
  public currentClient$ = this.currentClientSubject.asObservable();

  constructor(private clientService: ClientService) {
    this.loadHardcodedClient(); // Cargar al inicializar
  }

  private loadHardcodedClient() {
    this.clientService.getClienthardcoded('id').subscribe(client => {
      this.currentClientSubject.next(client);
    });
  }

  getCurrentClient(): Client | null {
    return this.currentClientSubject.value;
  }

  setCurrentClient(client: Client) {
    this.currentClientSubject.next(client);
  }

  reloadCurrentClient() {
    const currentClient = this.getCurrentClient();
    if (currentClient?.id) {
      console.log('🔥 ClientContextService: Recargando cliente desde servidor...');
      this.clientService.getClienthardcoded(currentClient.id).subscribe({
        next: (updatedClient) => {
          this.currentClientSubject.next(updatedClient);
          console.log('🔥 ClientContextService: Cliente recargado exitosamente:', updatedClient);
        },
        error: (error) => {
          console.error('Error recargando cliente:', error);
        }
      });
    } else {
      // Si no hay cliente actual, cargar el hardcoded
      this.loadHardcodedClient();
    }
  }
}