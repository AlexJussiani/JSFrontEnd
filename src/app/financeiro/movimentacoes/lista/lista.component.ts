import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Movimentacao } from '../../models/movimentacao';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaMovimentacaoComponent implements OnInit{

  public movimentacoes: Movimentacao[];
  errors: any[] = [];
  valorDebitado = 0;
  valorCreditado = 0;
  valorSaldo = 0;

  constructor(
    private contaService: FinanceiroService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.obterMovimentacao();
  }

  ngOnChanges(): void {
    console.log('teste: ', this.movimentacoes)
  }



  obterMovimentacao(){
    this.spinner.show();
    this.contaService.obterMovimentacoes()
      .subscribe({
        next: (movimentacao) => {this.movimentacoes = movimentacao, console.log('teste: ', this.calcValor()), this.spinner.hide()},
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      });
  }

  calcValor(){
   this.movimentacoes.filter( v => v.tipoConta == '2').forEach(v => this.valorCreditado += v.valor)
   this.movimentacoes.filter( v => v.tipoConta == '1').forEach(v => this.valorDebitado += v.valor)
   this.valorSaldo = this.valorCreditado - this.valorDebitado
  }

  processarFalha(fail: any){

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
