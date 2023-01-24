import { Produto } from 'src/app/produto/models/produtos';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, merge, Observable } from 'rxjs';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { ProdutoService } from '../services/produto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  produtoForm: FormGroup;
  errors: any[] = [];
  produto: Produto = new Produto();
  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;

  validationMessages: ValidationMessages;

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {


    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      descricao: {
        required: 'Informe a Descrição',
      },
      valor: {
        required: 'Informe o Valor',
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.produto = this.route.snapshot.data['produto']
  }

  ngOnInit(): void {
    this.spinner.show();
    this.produtoForm = this.fb.group({
      id:'',
      nome: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      ativo: [true],
      saida: [false],
      entrada: [false]
    });

    this.preencherForm();
    this.spinner.hide();
  }

  preencherForm(){
    this.produtoForm.patchValue({
      id: this.produto.id,
      nome: this.produto.nome,
      descricao: this.produto.descricao,
      valor: this.produto.valor,
      ativo: this.produto.ativo,
      saida: this.produto.saida,
      entrada: this.produto.entrada,
    })
  }

  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.produtoForm);
    });
  }

  editarCliente(){
    if (this.produtoForm.dirty && this.produtoForm.valid) {

      this.produto = Object.assign({}, this.produto, this.produtoForm.value);
      console.log('teste: ', this.produto)
      this.produtoService.atualizarProduto(this.produto)
      .subscribe(
        sucesso => { this.processarSucesso(sucesso) },
        falha => { this.processarFalha(falha) }
      );

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

  processarSucesso(response: any) {
    this.errors = [];

    let toast = this.toastr.success('Produto atualizado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

}
