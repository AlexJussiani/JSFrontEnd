import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Conta } from '../../models/contas';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})
export class ReceberEditarComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  errors: any[] = [];
  contaForm: FormGroup;
  produtosForm: FormGroup;
  displayMessage: DisplayMessage = {};
  conta: Conta = new Conta();
  produtos = new Array();
  valorTotal :number = 0

  datavencimento1: NgbDateStruct;
  datacompra1: NgbDateStruct;

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private contaService: FinanceiroService,
    ) {
      this.conta = this.route.snapshot.data['conta'];
    }

  ngOnInit(): void {
    this.contaForm = this.fb.group({
      id: '',
      dataVencimento: ['', [Validators.required]],
      dataCompra: ['', [Validators.required]]
    })
    this.contaForm.addControl(
      'contaItems', new FormArray(this.createItems())
    )
    this.preencherForm();
    this.obterProdutos();
    this.sumValorTotal();
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


  preencherForm() {
    this.contaForm.patchValue({
      id: this.conta.id,
      dataCompra: this.conta.dataCompra,
      dataVencimento: this.conta.dataVencimento,
       })
  }

  obterProdutos(){
    this.contaService.obterProdutosSaida()
    .subscribe({
      next: (produtos) => {this.produtos = produtos},
      error: (falha) => { this.processarFalha(falha) }
    })
  }

  editarConta(){
    if(this.contaForm.valid && this.contaForm.valid){
      this.conta = Object.assign({}, this.conta, this.contaForm.value);
      console.log('data: ', this.conta)
      this.contaService.atualizarConta(this.conta)
      .subscribe({
        next: (sucesso) => {this.processarSucesso(sucesso)},
          error: (falha) => {this.processarFalha(falha)}
      })
    }
  }

  abrirModal(content){
    this.modalService.open(content);
    this.produtosForm = this.fb.group({
      produtos: this.buildProdutos()
    })
  }

  buildProdutos(){
    const values = this.produtos.map(v => new FormControl(false))
    return this.fb.array(values);
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
    this.contaForm.removeControl('contaItems')
    this.contaForm.addControl(
      'contaItems', new FormArray(this.createItems())
    )
    this.conta.contaItems.forEach(v => this.valorTotal += (v.quantidade * v.valorUnitario))
    if(this.produtosForm.valid){
      this.modalService.dismissAll();
    }
  }


  getProdutosControls() {
    return this.produtosForm.get('produtos') ? (<FormArray>this.produtosForm.get('produtos'))['controls'] : null;
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

  getItensControls() {
    return this.contaForm.get('contaItems') ? (<FormArray>this.contaForm.get('contaItems'))['controls'] : null;
  }

  sumValorTotal(){
    this.valorTotal = 0;
    this.contaForm.value.contaItems.forEach(v => this.valorTotal += (v.quantidade * v.valorUnitario))
  }

  RemoverItemLista(event, item){
    this.conta = Object.assign({}, this.conta, this.contaForm.value);
    this.conta.contaItems = this.conta.contaItems.filter(v => v.produtoId !== item.value.produtoId);
    this.loadControlsContaItems();
    this.sumValorTotal()
  }

  processarSucesso(response: any) {
    this.contaForm.reset();
    this.errors = [];
    let toast = this.toastr.success('Conta atualizada com sucesso!', 'Sucesso!');
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

}
