import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ProdutoService } from './estoque-produto.service'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-estoque-produto',
  standalone: false,
  templateUrl: './estoque-produto.html',
  styleUrls: ['./estoque-produto.css']
})

@Injectable({ providedIn: 'root' })
export class EstoqueProduto implements OnInit, AfterViewInit {
  produtoId: string | null = null

  produto = {
    codigoProduto: 0,
    codigoBarras: '',
    nome: '',
    descricao: '',
    valorVenda: '',
    quantidadeEstoqueMinimo: 0
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService
  ) { }

  @ViewChild('inputFocado') inputFocado!: ElementRef<HTMLInputElement>
  
  ngAfterViewInit() {
    this.focarInput() // garante foco assim que a view carregar
  }

  focarInput() {
    this.inputFocado.nativeElement.focus()
  }

  ngOnInit(): void {
    this.produtoId = this.route.snapshot.paramMap.get('id')

    if (this.produtoId) {
      this.produtoService.buscarPorId(this.produtoId).subscribe({
        next: (dados: {
          codigoProduto: number
          codigoBarras: string
          nome: string
          descricao: string
          valorVenda: string
          quantidadeEstoqueMinimo: number

        }) => {
          this.produto = dados
        },
        error: (err) => {
          console.error('Erro ao buscar produto', err)
        }
      })
    }
  }

  chamaApi() {
    if (this.produtoId != 'null') {
      //API Update
      this.produtoService.atualizarProduto(this.produto)
        .subscribe({
          next: (res) => {
            console.log('Produto atualizado com sucesso:', res)
            console.log('Objeto enviado:', this.produto)
          },
          error: (err) => {
            console.error('Erro ao atualizar:', err)
          }
        })

    }
    else {
      //API Criar
      console.log(this.produto.nome)

      sessionStorage.setItem('produtoTemp', JSON.stringify(this.produto))
      this.router.navigate(['/movimentacao/null'])

    }
  }
}
