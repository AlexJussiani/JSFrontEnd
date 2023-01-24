import { Component } from '@angular/core';
import { Cliente } from '../models/cliente';

import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'


@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent {

  cliente: Cliente = new Cliente();
  enderecoMap;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {

      this.cliente = this.route.snapshot.data['cliente'];
      this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?q=" + this.EnderecoCompleto() + "&key=AIzaSyAP0WKpL7uTRHGKWyakgQXbW6FUhrrA5pE");
      console.log('teste: ', this.EnderecoCompleto());
  }

  public EnderecoCompleto(): string {
    return this.cliente.endereco?.logradouro + ", " + this.cliente.endereco?.numero + " - " + this.cliente.endereco?.cidade + " - " + this.cliente.endereco?.estado;
  }
}
