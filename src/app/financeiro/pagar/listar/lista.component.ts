import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, switchMap, take } from 'rxjs';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Conta, StatusConta } from '../../models/contas';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-listar',
  templateUrl: './lista.component.html'
})
export class PagarListaComponent implements OnInit {

  private readonly TIPO = 1  // 2 - Tipo Receber. 1 - Tipo Pagar

  public contas: Conta[];
  statusNumber: number = 0;
  errors: any[] = []
  statusContas: StatusConta[];
  statusSelecionado : StatusConta = new StatusConta(0,'Todos') ;
  valorTotal = 0;

  constructor(
    private contaService: FinanceiroService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private alertService: AlertModalService
  ) {
    this.statusContas = this.preencherStatus();
  }

  ngOnInit(): void {
    this.obterContas();
  }

  obterContas(){
    this.spinner.show();
    this.contaService.obterTodos(this.TIPO)
      .subscribe({
        next: (conta) => {this.contas = conta, this.calcuValorTotal(), this.spinner.hide()},
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      });
  }

  calcuValorTotal(){
    this.valorTotal = 0;
    this.contas.forEach(v => this.valorTotal += v.valorTotal)
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

  public preencherStatus(){
    return [
     new StatusConta(0, "Todos"),
     new StatusConta(1, "A Pagar"),
     new StatusConta(2, "Pagas")
    ]
  }

  obterPorStatus(status: number){
    this.spinner.show();
    if(this.statusNumber == 0)
      this.obterContas();
    else{
      this.contaService.obterPorStatus(status, this.TIPO)
      .subscribe({
        next: (conta) => {this.contas = conta, this.calcuValorTotal(), this.spinner.hide()},
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      });
    }
  }

  onTipoId(id){
    this.statusNumber = id.value
    this.obterPorStatus(this.statusNumber);
  }

  onRegistrarPagamento(conta){
    const result$ = this.alertService.showConfirm('Confirmação', 'Registrar Pagamento?')

    result$.asObservable().pipe(

      take(1),
      switchMap(result => result ? this.cadastrarRecebimento(conta) : EMPTY)
    )
    .subscribe({
      next: (sucesso) => {this.processarSucesso(sucesso)},
      error: (falha) => { this.processarFalha(falha) }
       // this.deleteModalRef.hide();
    })
  }

  cadastrarRecebimento(conta: Conta): Observable<Conta>{
    this.spinner.show();
    return this.contaService.registrarRecebimento(conta.id)
  }

  processarSucesso(response: any) {
    this.spinner.hide();
    this.errors = [];
    let toast = this.toastr.success('Conta Paga com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.obterPorStatus(this.statusNumber)
        //this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }
}
