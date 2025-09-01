import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientContextService } from '@/pages/service/client-context.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private clientContextService: ClientContextService) {}

      ngOnInit() {
    // 🔥 El contexto se inicializa automáticamente porque ya lo tienes en el constructor del servicio
    // Pero puedes suscribirte para ver cuando se carga
    this.clientContextService.currentClient$.subscribe(client => {
      if (client) {
        console.log('Cliente cargado globalmente:', client);
      }
    });
}
}
