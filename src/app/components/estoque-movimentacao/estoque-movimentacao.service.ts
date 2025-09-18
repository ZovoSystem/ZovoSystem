import { EstoqueMovimentacao } from './estoque-movimentacao';
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EstoqueMovimentacaoService {
  private apiProdutoUrl = 'http://localhost:1212/api/produto'
  private apiMovimentacaoUrl = 'http://localhost:1212/api/movimentacao'

  constructor(private http: HttpClient) { }

  criarProduto(novaVenda: any): Observable<any> {
    return this.http.post<any>(this.apiProdutoUrl, novaVenda)
  }

  adicionarMovimentacao(codigoProduto: any, novaVenda: any): Observable<any> {
    console.log(novaVenda)
    return this.http.post<any>(`${this.apiMovimentacaoUrl}/codigoproduto:${codigoProduto}`, novaVenda)
  }

  buscarMovimentacoes(codigoProduto: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiMovimentacaoUrl}/codigoproduto:${codigoProduto}`)
  }
}
