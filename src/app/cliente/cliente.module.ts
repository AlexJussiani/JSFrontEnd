import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { NgBrazil } from 'ng-brazil'
import { TextMaskModule } from 'angular2-text-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ClienteRoutingModule } from './cliente.route';
import { ClienteAppComponent } from './cliente.app.component';
import { ListaComponent } from './lista/lista.component';
import { ClienteService } from './services/cliente.service';
import { EditarComponent } from './editar/editar.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { NovoComponent } from './novo/novo.component';
import { ClienteResolve } from './services/cliente.resolve';
import { ClienteGuard } from './services/cliente.guard';

@NgModule({
  declarations: [
    ClienteAppComponent,
    NovoComponent,
    ListaComponent,
    EditarComponent,
    ExcluirComponent,
    DetalhesComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgBrazil,
    NgxSpinnerModule
  ],
 exports: [
    NgxSpinnerModule,
  ],
  providers: [
    ClienteService,
    ClienteResolve,
    ClienteGuard
  ]
})
export class clienteModule { }
