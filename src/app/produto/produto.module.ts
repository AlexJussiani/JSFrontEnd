import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageCropperModule } from 'ngx-image-cropper';

import { ListaComponent } from './lista/lista.component';
import { ProdutoAppComponent } from './produto.app.component';
import { ProdutoRoutingModule } from './produto.route';
import { ProdutoService } from './services/produto.service';
import { ClienteGuard } from './services/produto.guard';
import { NovoComponent } from './novo/novo.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditarComponent } from './editar/editar.component';
import { ProdutoResolve } from './services/produto.resolve';



@NgModule({
  declarations: [
    ListaComponent,
    ProdutoAppComponent,
    NovoComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,CommonModule,
    ProdutoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgxSpinnerModule
  ],
  providers: [
    ProdutoService,
    ProdutoResolve,
    ClienteGuard
  ]
})
export class ProdutoModule { }
