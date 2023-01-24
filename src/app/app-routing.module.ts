import { NotFoundComponent } from './navegacao/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './navegacao/home/home.component';
import { AcessoNegadoComponent } from './navegacao/acesso-negado/acesso-negado.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'conta',
    loadChildren: () => import('./conta/conta.module')
      .then(m => m.ContaModule)
  },
  {
    path: 'produtos',
    loadChildren: () => import('./produto/produto.module')
      .then(m => m.ProdutoModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./cliente/cliente.module')
      .then(m => m.clienteModule)
  },
  {
    path: 'financeiro',
    loadChildren: () => import('./financeiro/financeiro.module')
      .then(m => m.FinanceiroModule)
  },
  {path: 'acesso-negado', component: AcessoNegadoComponent },
  {path: 'nao-encontrado', component: NotFoundComponent },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
