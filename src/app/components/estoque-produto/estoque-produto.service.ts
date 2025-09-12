import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:1212/api/produto'

  constructor(private http: HttpClient) {}

  buscarPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }

  atualizarProduto(produto: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, produto)
  }
}
