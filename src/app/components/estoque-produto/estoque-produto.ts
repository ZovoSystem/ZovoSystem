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
    codigoProduto: null,
    codigoBarras: '',
    nome: '',
    descricao: '',
    quantidadeEstoqueMinimo: null,
    valorVenda: null,
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
          quantidadeEstoqueMinimo: number
          valorVenda: number

        }) => {
          console.log(dados)
          this.produto = dados
          console.log(this.produto)
        },
        error: (err) => {
          console.error('Erro ao buscar produto', err)
        }
      })
    }

    this.produtoId = this.route.snapshot.paramMap.get('id')
    if (this.produtoId === 'null') {
      const produtoString = sessionStorage.getItem('produtoTemp')

      if (produtoString) {
        const produtoStorage = JSON.parse(produtoString)

        this.produto.codigoBarras = produtoStorage.codigoBarras
        this.produto.nome = produtoStorage.nome
        this.produto.descricao = produtoStorage.descricao
        this.produto.quantidadeEstoqueMinimo = produtoStorage.quantidadeEstoqueMinimo
        this.produto.valorVenda = produtoStorage.valorVenda

      } else {
        console.warn('Produto não encontrado no sessionStorage')
      }
    }
  }

  chamaApi() {
    if (this.produtoId != 'null') {
      //API Update
      this.produtoService.atualizarProduto(this.produto)
        .subscribe({
          next: (res) => {
            this.router.navigate(['/estoque'])
          },
          error: (err) => {
            console.error('Erro ao atualizar:', err)
            alert("Erro inesperado")
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
