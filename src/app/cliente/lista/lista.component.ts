import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { Page } from 'src/app/models/Pagination';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  errors: any[] = [];
  public clientes: Cliente[];
  public page: Page<Cliente>;
  errorMessage: string;

  constructor(
    private clienteService: ClienteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.clienteService.obterTodos()
      .subscribe({
        next: (page) => {this.page = page, this.clientes = this.page.list, this.spinner.hide()},
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      });
  }

  processarFalha(fail: any) {
    this.spinner.hide()
    if(fail.status === 400)
      this.errors = fail.error.errors?.Mensagens;
    else
     this.errors = fail.error?.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(',{
      progressAnimation: 'increasing',
      progressBar: true
    });
  }
}
