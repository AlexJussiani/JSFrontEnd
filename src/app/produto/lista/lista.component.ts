import { ProdutoService } from './../services/produto.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produtos';
import { NgxSpinnerService } from 'ngx-spinner';
import { Page } from 'src/app/models/Pagination';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  imagens: string = environment.imagensUrl;
  errors: any[] = [];
  public page: Page<Produto>;
  public produtos: Produto[];

  constructor(private produtoService: ProdutoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.produtoService.obterTodos()
      .subscribe({
        next: (page) => {this.page = page, this.produtos = this.page.list, this.spinner.hide()},
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

