import { ProdutoService } from './../services/produto.service';
import { Produto } from './../models/produtos';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DisplayMessage } from 'src/app/utils/generic-form-validation';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: []
})
export class NovoComponent implements OnInit {

  displayMessage: DisplayMessage = {};
  errors: any[] = [];
  produtoForm: FormGroup;
  produto: Produto = new Produto();

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private produtoService: ProdutoService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      valor: ['', [Validators.required]],
      entrada: [false, ],
      saida: [false, ],
    });
  }

  adicionarProduto(){
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.spinner.show();
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);
      this.produto.ativo = true;
      this.produtoService.registrarProduto(this.produto)
        .subscribe({
          next: (sucesso) => { this.processarSucesso(sucesso) },
          error: (falha) => { this.processarFalha(falha) }
        })
    }
  }
  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];
    this.spinner.hide();
    let toast = this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.spinner.hide();
    if(fail.status === 400)
      this.errors = fail.error.errors.Mensagens;
    else
     this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(',{
      progressAnimation: 'increasing',
      progressBar: true
    });
  }
}
