import { FinanceiroResolve } from './services/financeiro.resolve';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { FinanceiroAppComponent } from './financeiro.app.component';
import { FinanceiroRoutingModule } from './financeiro.router';
import { FinanceiroService } from './services/financeiro.service';
import { ReceberListaComponent } from './receber/lista/lista.component';
import { ReceberNovoComponent } from './receber/novo/novo.component';
import { ReceberDetalheComponent } from './receber/detalhe/detalhe.component';
import { ReceberEditarComponent } from './receber/editar/editar.component';
import { PagarListaComponent } from './pagar/listar/lista.component';
import { PagarNovoComponent } from './pagar/novo/novo.component';
import { ListaMovimentacaoComponent } from './movimentacoes/lista/lista.component';


@NgModule({
  declarations: [
    FinanceiroAppComponent,
    ReceberListaComponent,
    ReceberNovoComponent,
    ReceberDetalheComponent,
    ReceberEditarComponent,
    PagarListaComponent,
    PagarNovoComponent,
    ListaMovimentacaoComponent
  ],
  imports: [
    CommonModule,CommonModule,
    FinanceiroRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbModule
  ],
  providers: [
    FinanceiroService,
    FinanceiroResolve
  ]
})
export class FinanceiroModule { }
