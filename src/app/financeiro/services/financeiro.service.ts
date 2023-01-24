import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { Produto } from "src/app/produto/models/produtos";
import { BaseService } from "src/app/services/base.service";
import { Cliente, Conta } from "../models/contas";
import { Movimentacao } from "../models/movimentacao";


@Injectable()
export class FinanceiroService extends BaseService {

  public readonly TIPO = 2  // 2 - Tipo Receber. 1 - Tipo Pagar

  constructor(private http: HttpClient) { super();}
  //2 para receber. 1 para pagar
  obterTodos(tipo: number): Observable<Conta[]>{
    return   this.http
         .get<Conta[]>(`${this.UrlServiceGatewayV1}contas/por-tipo/${tipo}`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterMovimentacoes(): Observable<Movimentacao[]>{
    return   this.http
         .get<Movimentacao[]>(`${this.UrlMovimentacaoFinanceiraV1}movimentacoes`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterPorId(id: string): Observable<Conta>{
    return   this.http
         .get<Conta>(`${this.UrlServiceGatewayV1}contas/por-idConta/`+ id, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterPorStatus(status: number, tipo: number): Observable<Conta[]>{
    return this.http
    .get<Conta[]>(`${this.UrlServiceGatewayV1}contas/por-status/${tipo}?status=${status}`, this.ObterAuthHeaderJson())
    .pipe(
      map((obj) => obj),
      catchError(super.serviceError)
    );
  }

  obterFornecedores(): Observable<Cliente[]> {
    return this.http
        .get<Cliente[]>(this.UrlServiceClientesV1 + "parceiros/fornecedor", this.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
  }

   obterClientes(): Observable<Cliente[]> {
    return this.http
        .get<Cliente[]>(this.UrlServiceClientesV1 + "parceiros/cliente", this.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
  }

  obterProdutosEntrada(): Observable<Produto[]>{
    return  this.http
         .get<Produto[]>(`${this.UrlServiceProdutosV1}produtos/entrada`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterProdutosSaida(): Observable<Produto[]>{
    return  this.http
         .get<Produto[]>(`${this.UrlServiceProdutosV1}produtos/saida`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  registrarConta(conta: Conta): Observable<Conta>{
    return  this.http
        .post(`${this.UrlServiceContasV1}contas/Adicionar`, conta, this.ObterAuthHeaderJson())
        .pipe(
          map(this.extractData),
          catchError(super.serviceError)
        );
  }

  registrarRecebimento(id: string): Observable<Conta>{
    const idConta = {idConta: id}
    return this.http
    .put(this.UrlServiceContasV1 + "contas/Realizar-Pagamento", idConta, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    );
  }

  atualizarConta(conta: Conta): Observable<Conta> {
    return this.http
      .put(this.UrlServiceContasV1 + "contas/atualizar/" + conta.id, conta, super.ObterAuthHeaderJson())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError)
      );
}
}

