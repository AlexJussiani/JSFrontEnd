import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomValidators } from '@narik/custom-validators';
import { fromEvent, merge, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


import { ContaService } from './../services/conta.service';
import { Usuario } from '../models/usuario';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: []
})
export class CadastroComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = []
  cadastroForm: FormGroup;
  usuario: Usuario;
  mudancasNaoSalvas: boolean;

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  constructor(private fb: FormBuilder,
    private contaService: ContaService,
    private router: Router,
    private toastr: ToastrService) {
      this.validationMessages = {
        nome: {
          required: 'Informe o nome',
          rangeLength: 'O Nome deve possuir pelo menos 5 caracteres'
        },
        email: {
          required: 'Informe o e-mail',
          email: 'Email inválido'
        },
        senha: {
          required: 'Informe a senha',
          rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
        },
        senhaConfirmacao: {
          required: 'Informe a senha novamente',
          rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
          equalTo: 'As senhas não conferem'
        }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    let pass = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    let passConfirm = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(pass)]);

    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      senha: pass,
      senhaConfirmacao: passConfirm,
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
      merge(...controlBlurs).subscribe(() => {
        this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
        this.mudancasNaoSalvas = true;

    });
  }

  adicionarConta(){
    if(this.cadastroForm.dirty && this.cadastroForm.valid){
      this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);

    this.contaService.registrarUsuario(this.usuario)
      .subscribe({
        next: (sucesso) => this.processarSucesso(sucesso),
        error: (falha) =>  this.processarFalha(falha)
      });
    }
  }

  processarSucesso(response: any){
    this.cadastroForm.reset();
    this.errors = [];

    this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);
    let toast = this.toastr.success('Registro realizado com Sucesso!', 'Bem vindo!!!', {
      progressAnimation: 'increasing',
      progressBar: true,
      timeOut: 1000
    });
    if(toast){
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/home']);
      });
      this.mudancasNaoSalvas = false;
    }
  }

  processarFalha(fail: any){

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
