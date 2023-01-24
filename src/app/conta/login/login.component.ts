import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomValidators } from '@narik/custom-validators';
import { fromEvent, merge, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


import { ContaService } from './../services/conta.service';
import { Usuario } from '../models/usuario';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = []
  loginForm: FormGroup;
  usuario: Usuario;

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  constructor(private fb: FormBuilder,
    private contaService: ContaService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
      this.validationMessages = {
        email: {
          required: 'Informe o e-mail',
          email: 'Email inválido'
        },
        senha: {
          required: 'Informe a senha',
          rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
        }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {


    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]]
    });
  }

  ngAfterViewInit(): void {

    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

      merge(...controlBlurs).subscribe(() => {
        this.displayMessage = this.genericValidator.processarMensagens(this.loginForm);
    });
  }

  login(){
    this.spinner.show();
    if(this.loginForm.dirty && this.loginForm.valid){
      this.usuario = Object.assign({}, this.usuario, this.loginForm.value);

      this.contaService.login(this.usuario)
      .subscribe({
          next: (sucesso) => this.processarSucesso(sucesso),
          error: (falha) =>  this.processarFalha(falha)
        });

    // this.contaService.login(this.usuario)
    //   .subscribe({
    //     next: (sucesso) => this.processarSucesso(sucesso),
    //     error: (falha) =>  this.processarFalha(falha)
    //   });
    }
  }

  processarSucesso(response: any){

    this.spinner.hide();


    this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);
    let toast = this.toastr.success('Login realizado com Sucesso!', 'Bem vindo!!!', {
      progressAnimation: 'increasing',
      progressBar: true,
      timeOut: 1000
    });
    this.loginForm.reset();
    this.errors = [];
    if(toast){
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/financeiro/receber/listar-todos']);
      });
    }
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

