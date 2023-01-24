import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { FinanceiroService } from '../../services/financeiro.service';
import { ToastrService } from 'ngx-toastr';
import { Conta, StatusConta } from '../../models/contas';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { EMPTY, switchMap, take, Observable } from 'rxjs';
import { DisplayMessage } from 'src/app/utils/generic-form-validation';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ReceberListaComponent implements OnInit {

  deleteModalRef: BsModalRef;
  displayMessage: DisplayMessage = {};

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  page = 1
  pageSize = 10

  private readonly TIPO = 2  // 2 - Tipo Receber. 1 - Tipo Pagar

  public contas: Conta[];
  statusNumber: number = 0;
  errors: any[] = []
  statusContas: StatusConta[];
  statusSelecionado : StatusConta = new StatusConta(0,'Todos');
  valorTotal = 0;


  constructor(
    private contaService: FinanceiroService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private alertService: AlertModalService,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar
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
     // this.registrarRecebimento
  }

  calcuValorTotal(){
    this.valorTotal = 0;
    console.log('tamanho: ', this.contas.length)
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

  onTipoId(id){
    this.statusNumber = id.value
    this.obterPorStatus(this.statusNumber);
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

  public preencherStatus(){
    return [
     new StatusConta(0, "Todos"),
     new StatusConta(1, "A Receber"),
     new StatusConta(2, "Recebidas")
    ]
  }

  onRegistrarRecebimento(conta){
    const result$ = this.alertService.showConfirm('Conformação', 'Registrar Recebimento?')

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

  registrarRecebimento(){
    this.contas.map(v => this.contaService.registrarRecebimento(v.id));
   // this.contaService.registrarRecebimento(conta)
  }

  processarSucesso(response: any) {
    this.spinner.hide();
    this.errors = [];
    let toast = this.toastr.success('Conta recebida com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.obterPorStatus(this.statusNumber)
        //this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }


  //Informações sobre data
  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

  isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

}
