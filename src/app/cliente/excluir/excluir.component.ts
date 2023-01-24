import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';


@Component({
  selector: 'app-excluir',
  templateUrl: './excluir.component.html'
})
export class ExcluirComponent {

  cliente: Cliente = new Cliente();

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

    this.cliente = this.route.snapshot.data['cliente'];
  }

  excluirEvento() {
    this.spinner.show();
    this.clienteService.excluirCliente(this.cliente.id)
      .subscribe({
        next: (cliente) => { this.sucessoExclusao(cliente) },
        error: () => { this.falha() }
  });
  }

  sucessoExclusao(evento: any) {
    this.spinner.hide();
    const toast = this.toastr.success('Cliente excluido com Sucesso!', 'Sucesso!!!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/clientes/listar-todos']);
      });
    }
  }

  falha() {
    this.spinner.hide();
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
  }
}
