import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CaixaServices {

  private produtoUrl = 'http://localhost:1212/api/produto/'
  private vendaUrl = 'http://localhost:1212/api/venda'

  constructor(private http: HttpClient) { }

  buscarProdutos(termo: string) {
    return this.http.get<any[]>(`${this.produtoUrl}termo:${encodeURIComponent(termo)}`)
  }

  buscarProdutosCodigoBarras(termo: string) {
  return this.http.get<{
    codigoProduto: number
    codigoBarras: string
    nome: string
    descricao: string
    valorVenda: number
    quantidadeEstoque: number
    quantidadeEstoqueMinimo: number
    statusEstoque: string
  }>(`${this.produtoUrl}barras:${encodeURIComponent(termo)}`)
}

  criarVenda(venda: any) {
    return this.http.post(`${this.vendaUrl}`, venda)
  }

  mandarImprimir(venda: any) {
    return this.http.post('http://localhost:7082/api/Venda/imprimir', venda)
  }
}
