import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseService } from 'src/app/services/base.service';
import { Produto } from '../models/produtos';
import { Page } from "src/app/models/Pagination";

@Injectable()
export class ProdutoService extends BaseService {

  pageIndex = 1;
  pagesize = 50;
  query = ''


    constructor(private http: HttpClient) { super()

        // this.cliente.nome = "Teste Fake"
        // this.cliente.cpf.numero = "32165498754"
        // this.cliente.excluido = false
        // this.cliente.telefone = '43999365610'
    }

    obterTodos(): Observable<Page<Produto>>{
        let teste =  this.http
             .get<Page<Produto>>(`${this.UrlServiceProdutosV1}produtos/Paginado?ps=${this.pagesize}&page=${this.pageIndex}&q=${this.query}`, this.ObterAuthHeaderJson())
            .pipe(
              map((obj) => obj),
              catchError(super.serviceError)
            );
            return teste;
    }

    obterProdutoPorId(id: string): Observable<Produto> {
        return this.http
          .get<Produto>(this.UrlServiceProdutosV1 +"produtos/" + id, super.ObterAuthHeaderJson())
          .pipe(
            map((obj) => obj),
            catchError(super.serviceError)
          );
    }

    registrarProduto(produto: Produto): Observable<Produto> {
      return this.http
        .post(this.UrlServiceProdutosV1 +"produtos", produto, super.ObterAuthHeaderJson())
        .pipe(
          map(super.extractData),
          catchError(super.serviceError)
        );
    }

    atualizarProduto(produto: Produto): Observable<Produto> {
      return this.http
        .put(this.UrlServiceProdutosV1 + "produtos/" + produto.id, produto, super.ObterAuthHeaderJson())
        .pipe(
          map(super.extractData),
          catchError(super.serviceError)
        );
    }
}
