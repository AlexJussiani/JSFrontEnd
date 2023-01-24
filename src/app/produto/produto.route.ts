import { ProdutoResolve } from './services/produto.resolve';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaComponent } from './lista/lista.component';
import { NovoComponent } from './novo/novo.component';
import { ProdutoAppComponent } from './produto.app.component';
import { EditarComponent } from './editar/editar.component';

const produtoRouterConfig: Routes = [
    {
        path: '', component: ProdutoAppComponent,
        children: [
          { path: 'listar-todos', component: ListaComponent },
          { path: 'adicionar-novo', component: NovoComponent },
          { path: 'editar/:id', component: EditarComponent,
            resolve: {
              produto: ProdutoResolve
            }
          },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(produtoRouterConfig)
    ],
    exports: [RouterModule]
})
export class ProdutoRoutingModule { }
