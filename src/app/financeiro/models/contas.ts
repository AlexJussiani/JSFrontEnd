export class Conta{
  id: string;
  codigo: string;
  clienteId: string;
  valorTotal: number;
  dataCadastro: string;
  dataCompra: string;
  dataVencimento: string;
  tipoConta: string;
  statusConta: string;
  nome: string;
  contaItems: ItemConta[]
}

export class ItemConta{
  idItem: string;
  produtoId: string;
  produtoNome: string;
  valorUnitario: number;
  quantidade: number;
}

export class StatusConta{

  constructor(
    public id: number,
    public nome: string){}
}

export interface Cliente{
  id: string,
  nome: string,
}
