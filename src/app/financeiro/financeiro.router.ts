import { ReceberDetalheComponent } from './receber/detalhe/detalhe.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinanceiroAppComponent } from "./financeiro.app.component";
import {ReceberListaComponent } from "./receber/lista/lista.component";
import {ReceberNovoComponent } from "./receber/novo/novo.component";
import { FinanceiroResolve } from './services/financeiro.resolve';
import { ReceberEditarComponent } from './receber/editar/editar.component';
import { PagarListaComponent } from './pagar/listar/lista.component';
import { PagarNovoComponent } from './pagar/novo/novo.component';
import { ListaMovimentacaoComponent } from './movimentacoes/lista/lista.component';

const financeiroRouterConfig: Routes = [
  {
      path: '', component: FinanceiroAppComponent,
      children: [
        { path: 'receber/listar-todos', component: ReceberListaComponent },
        { path: 'receber/novo', component: ReceberNovoComponent },
        {
          path: 'receber/detalhe/:id', component: ReceberDetalheComponent,
          resolve: {
            conta: FinanceiroResolve
          }
        },
        {
          path: 'receber/editar/:id', component: ReceberEditarComponent,
          resolve: {
            conta: FinanceiroResolve
          }
        },
        { path: 'pagar/listar-todos', component: PagarListaComponent },
        { path: 'pagar/novo', component: PagarNovoComponent },
        { path: 'movimentacao', component:  ListaMovimentacaoComponent},
      ]
  }
];

@NgModule({
    imports: [
        RouterModule.forChild(financeiroRouterConfig)
    ],
    exports: [RouterModule]
})
export class FinanceiroRoutingModule { }
