import { fromEvent, merge, Observable } from 'rxjs';
import { Component, ElementRef, OnInit, AfterViewInit, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControlName, FormArrayName, FormGroupName, FormControl } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Cliente, Conta } from '../../models/contas';
import { FinanceiroService } from '../../services/financeiro.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class ReceberNovoComponent implements OnInit  {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  TIPO_CONTA: string = "2" // A RECEBER
  STATUS_CONTA: string = "1" // A PAGAR

  errors: any[] = [];
  clienteForm: FormGroup;
  produtosForm: FormGroup;
  clientes: Cliente[];
  displayMessage: DisplayMessage = {};
  conta: Conta = new Conta();
  produtos = new Array();
  valorTotal :number = 0


  datavencimento1: NgbDateStruct;
  datacompra1: NgbDateStruct;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contaService: FinanceiroService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {   }

   ngOnInit(): void {

    this.obterProdutos();
    this.conta.contaItems = []
    this.contaService.obterClientes()
      .subscribe(
        clientes => this.clientes = clientes);

        this.clienteForm = this.fb.group({
          clienteId: ['', [Validators.required]],
          dataVencimento: ['', [Validators.required]],
          dataCompra: ['', [Validators.required]]
        });
        this.conta.statusConta = this.STATUS_CONTA
        this.conta.tipoConta = this.TIPO_CONTA
  }

  ngAfterViewInit(): void {
    this.configuracaoBase();

  }

  configuracaoBase(){
    let controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

       merge(...controlBlurs).subscribe(() =>{
       this.somaValorTotal()
     });
   }

   somaValorTotal(){
     this.conta.contaItems.forEach(v => this.valorTotal = (v.quantidade * v.valorUnitario))

   }


  buildProdutos(){
    const values = this.produtos.map(v => new FormControl(false))
    return this.fb.array(values);
  }


  getProdutosControls() {
    return this.produtosForm.get('produtos') ? (<FormArray>this.produtosForm.get('produtos'))['controls'] : null;
  }

  getItensControls() {
    return this.clienteForm.get('contaItems') ? (<FormArray>this.clienteForm.get('contaItems'))['controls'] : null;
  }

  adicionarConta(){
    this.configuraData()
    this.conta = Object.assign({}, this.conta, this.clienteForm.value);

    if(this.clienteForm.valid && this.clienteForm.valid){
      this.conta = Object.assign({}, this.conta, this.clienteForm.value)
      this.contaService.registrarConta(this.conta)
        .subscribe({
          next: (sucesso) => {this.processarSucesso(sucesso)},
          error: (falha) => {this.processarFalha(falha)}
        });
    }

  }

  processarSucesso(response: any) {
    this.clienteForm.reset();
    this.errors = [];
    let toast = this.toastr.success('Conta cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/financeiro/receber/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    if(fail.status === 400)
      this.errors = fail.error.errors.Mensagens;
    else
     this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(',{
      progressAnimation: 'increasing',
      progressBar: true
    });
  }

  configuraData(){
    //data compra
    let datacompra = this.clienteForm.value.dataCompra
    let datac =moment(`${datacompra.year}-${datacompra.month}-${datacompra.day}`).format("YYYY-MM-DD")
    this.clienteForm.value.dataCompra = datac;

    //data vencimento
    let datavencimento = this.clienteForm.value.dataVencimento
    let data =moment(`${datavencimento.year}-${datavencimento.month}-${datavencimento.day}`).format("YYYY-MM-DD")
    this.clienteForm.value.dataVencimento = data;
  }

  abrirModal(content){
    this.modalService.open(content);
    this.produtosForm = this.fb.group({
      produtos: this.buildProdutos()
    })
  }

  obterProdutos(){
    this.contaService.obterProdutosSaida()
    .subscribe({
      next: (produtos) => {this.produtos = produtos},
      error: (falha) => { this.processarFalha(falha) }
    })

  }

  onSubmit(){

    let valueSubmit = Object.assign({}, this.produtosForm.value)

    valueSubmit = Object.assign(valueSubmit, {
      produtos: valueSubmit.produtos
        .map((v, i) => v ? this.produtos[i] : null)
        .filter(v => v!= null)
    })
    let valortemp;
    for(var i = 0; i < valueSubmit.produtos.length; i++){
      valortemp = {
        'produtoId': valueSubmit.produtos[i].id,
        'produtoNome': valueSubmit.produtos[i].nome,
        'valorUnitario': valueSubmit.produtos[i].valor,
        'quantidade': 1
      }
      this.conta.contaItems.push(valortemp);
    }
    this.loadControlsContaItems()
  }

  loadControlsContaItems(){
    this.valorTotal = 0
    this.clienteForm.removeControl('contaItems')
    this.clienteForm.addControl(
      'contaItems', new FormArray(this.createItems())
    )
    this.conta.contaItems.forEach(v => this.valorTotal += (v.quantidade * v.valorUnitario))
    if(this.produtosForm.valid){
      this.modalService.dismissAll();
    }
  }

  createItems(): FormGroup[]{
    const values = this.conta.contaItems.map( v => this.fb.group({
      produtoId: [v.produtoId, Validators.required],
      produtoNome: [v.produtoNome, Validators.required],
      valorUnitario: [v.valorUnitario , Validators.required],
      quantidade: [v.quantidade, Validators.required]
    }))
    return values
  }

  sumValorTotal(){
    this.valorTotal = 0;
    this.clienteForm.value.contaItems.forEach(v => this.valorTotal += (v.quantidade * v.valorUnitario))
  }

  RemoverItemLista(event, item){
    this.conta = Object.assign({}, this.conta, this.clienteForm.value);
    this.conta.contaItems = this.conta.contaItems.filter(v => v.produtoId !== item.value.produtoId);
    this.loadControlsContaItems();
    this.sumValorTotal()
  }

}


