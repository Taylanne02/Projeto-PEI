import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function AvaliacoesAlunoPage() {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [formAberto, setFormAberto] = useState(false)
  const [formErro, setFormErro] = useState('')
  const [salvandoAvaliacao, setSalvandoAvaliacao] = useState(false)
  const [removendoAvaliacao, setRemovendoAvaliacao] = useState(false)
  const [avaliacaoForm, setAvaliacaoForm] = useState({
    id_avaliacao: null,
    nota: 5,
    comentario: '',
    titulo: '',
  })

  useEffect(() => {
    buscarAvaliacoes()
  }, [])

  async function buscarAvaliacoes() {
    try {
      setCarregando(true)
      setErro(null)

      // Pega o ID do aluno do localStorage
      const idAluno = localStorage.getItem('idAluno') || 1

      const dados = await api.getStudentReviews(idAluno)
      setAvaliacoes(dados.avaliacoes || [])
    } catch (e) {
      setErro(e.message || 'Erro ao carregar avaliações')
      setAvaliacoes([])
    } finally {
      setCarregando(false)
    }
  }

  function abrirFormularioAvaliacao(avaliacao) {
    setAvaliacaoForm({
      id_avaliacao: avaliacao.id_avaliacao,
      nota: avaliacao.nota || 5,
      comentario: avaliacao.comentario || '',
      titulo: avaliacao.titulo || '',
    })
    setFormErro('')
    setFormAberto(true)
  }

  function fecharFormularioAvaliacao() {
    setFormAberto(false)
    setFormErro('')
    setAvaliacaoForm({
      id_avaliacao: null,
      nota: 5,
      comentario: '',
      titulo: '',
    })
  }

  async function salvarAvaliacao() {
    if (!avaliacaoForm.nota) {
      setFormErro('Escolha uma nota entre 1 e 5.')
      return
    }

    try {
      setSalvandoAvaliacao(true)
      setFormErro('')

      await api.updateReview(avaliacaoForm.id_avaliacao, {
        nota: avaliacaoForm.nota,
        comentario: avaliacaoForm.comentario,
      })

      setAvaliacoes((current) =>
        current.map((avaliacao) =>
          avaliacao.id_avaliacao === avaliacaoForm.id_avaliacao
            ? { ...avaliacao, nota: avaliacaoForm.nota, comentario: avaliacaoForm.comentario }
            : avaliacao,
        ),
      )
      fecharFormularioAvaliacao()
    } catch (e) {
      setFormErro(e.message || 'Não foi possível salvar a avaliação.')
    } finally {
      setSalvandoAvaliacao(false)
    }
  }

  async function excluirAvaliacao(idAvaliacao) {
    try {
      setRemovendoAvaliacao(true)
      await api.deleteReview(idAvaliacao)
      setAvaliacoes((current) => current.filter((item) => item.id_avaliacao !== idAvaliacao))
    } catch (e) {
      setErro(e.message || 'Não foi possível excluir a avaliação.')
    } finally {
      setRemovendoAvaliacao(false)
    }
  }

  function renderizarEstrelas(nota) {
    const estrelas = []
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <span key={i} className={i <= nota ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
          ★
        </span>
      )
    }
    return estrelas
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Minhas avaliações</h1>

      <p className="mt-2 text-slate-600">
        Consulte ou registre avaliações sobre os cursos assistidos.
      </p>

      {carregando && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Carregando avaliações...
        </div>
      )}

      {erro && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="font-semibold">Erro ao carregar avaliações</p>
          <p className="text-sm">{erro}</p>
        </div>
      )}

      {!carregando && !erro && avaliacoes.length === 0 && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Nenhuma avaliação registrada.
        </div>
      )}

      {!carregando && avaliacoes.length > 0 && (
        <div className="mt-8 space-y-4">
          {avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id_avaliacao}
              className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4 p-4">
                {avaliacao.thumbnailUrl && (
                  <img
                    src={avaliacao.thumbnailUrl}
                    alt={avaliacao.titulo}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-bold text-slate-950 line-clamp-1">
                    {avaliacao.titulo}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                    {avaliacao.descricao}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Professor: <span className="font-semibold">{avaliacao.nomeProfessor}</span>
                  </p>

                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-600">Sua nota:</span>
                      <div className="flex gap-1">
                        {renderizarEstrelas(avaliacao.nota)}
                      </div>
                      <span className="text-sm font-bold text-slate-950">({avaliacao.nota}/5)</span>
                    </div>
                  </div>

                  {avaliacao.comentario && (
                    <p className="mt-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg italic">
                      "{avaliacao.comentario}"
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => abrirFormularioAvaliacao(avaliacao)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => excluirAvaliacao(avaliacao.id_avaliacao)}
                      disabled={removendoAvaliacao}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={formAberto} onOpenChange={(open) => !open && fecharFormularioAvaliacao()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar avaliação</DialogTitle>
            <DialogDescription>
              Atualize sua nota e comentário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">{avaliacaoForm.titulo}</p>
            </div>

            <div>
              <Label htmlFor="nota" className="mb-2 block text-sm font-medium text-slate-700">
                Nota
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                      avaliacaoForm.nota >= value
                        ? 'border-yellow-400 bg-yellow-100 text-slate-950'
                        : 'border-slate-300 bg-white text-slate-600'
                    }`}
                    onClick={() => setAvaliacaoForm((current) => ({ ...current, nota: value }))}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentario" className="text-sm font-medium text-slate-700">
                Comentário (opcional)
              </Label>
              <Textarea
                id="comentario"
                value={avaliacaoForm.comentario}
                onChange={(event) =>
                  setAvaliacaoForm((current) => ({ ...current, comentario: event.target.value }))
                }
                rows={4}
                placeholder="Conte como foi a aula"
              />
            </div>

            {formErro && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formErro}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button onClick={salvarAvaliacao} disabled={salvandoAvaliacao}>
                {salvandoAvaliacao ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}