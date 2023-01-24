import { ClienteGuard } from './services/cliente.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteAppComponent } from './cliente.app.component';
import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { ClienteResolve } from './services/cliente.resolve';

const clienteRouterConfig: Routes = [
    {
        path: '', component: ClienteAppComponent,
        children: [
            { path: 'listar-todos', component: ListaComponent },
            {
              path: 'adicionar-novo', component: NovoComponent,
              canActivate: [ClienteGuard],
              data: [{claim: {nome: 'Cliente', valor: 'Cadastrar'}}]
             },
            {
              path: 'editar/:id', component: EditarComponent,
              canActivate: [ClienteGuard],
              //data: [{claim: {nome: 'Cliente', valor: 'Editar'}}],
              resolve: {
                cliente: ClienteResolve
              }
            },
            {
              path: 'detalhes/:id', component: DetalhesComponent,
              resolve: {
                cliente: ClienteResolve
              }
            },
            {
              path: 'excluir/:id', component: ExcluirComponent,
              canActivate: [ClienteGuard],
              data: [{claim: {nome: 'Cliente', valor: 'Remover'}}],
              resolve: {
                cliente: ClienteResolve
              }
            }

        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(clienteRouterConfig)
    ],
    exports: [RouterModule]
})
export class ClienteRoutingModule { }
