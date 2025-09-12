import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = 'http://localhost:1212/api/produto' // ajuste para a sua API

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  buscarProdutos(termo: string) {
    return this.http.get<any[]>(`${this.apiUrl}/termo:${encodeURIComponent(termo)}`)
  }
}
