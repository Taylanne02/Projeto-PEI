import { useState, useEffect } from 'react'
import { ExternalLink, ImageIcon, Star, Trash2 } from 'lucide-react'
import { api } from '../../services/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

export function ComprasPage() {
  const [compras, setCompras] = useState([])
  const [avaliacoes, setAvaliacoes] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [formAberto, setFormAberto] = useState(false)
  const [formErro, setFormErro] = useState('')
  const [salvandoAvaliacao, setSalvandoAvaliacao] = useState(false)
  const [removendoAvaliacao, setRemovendoAvaliacao] = useState(false)
  const [reportandoAula, setReportandoAula] = useState(false)
  const [reportTargetId, setReportTargetId] = useState(null)
  const [reportType, setReportType] = useState('')
  const [reportDetail, setReportDetail] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const [avaliacaoForm, setAvaliacaoForm] = useState({
    id_videoaula: null,
    id_avaliacao: null,
    titulo: '',
    nota: 5,
    comentario: '',
  })

  useEffect(() => {
    buscarCompras()
  }, [])

  async function buscarCompras() {
    try {
      setCarregando(true)
      setErro(null)
      const idAluno = localStorage.getItem('idAluno') || 1

      const [dadosCompras, dadosAvaliacoes] = await Promise.all([
        api.getStudentPurchases(idAluno),
        api.getStudentReviews(idAluno),
      ])

      setCompras(dadosCompras.compras || [])
      setAvaliacoes(
        (dadosAvaliacoes.avaliacoes || []).reduce((acc, avaliacao) => {
          acc[avaliacao.id_videoaula] = avaliacao
          return acc
        }, {}),
      )
    } catch (e) {
      setErro(e.message || 'Erro ao carregar aulas adquiridas')
      setCompras([])
      setAvaliacoes({})
    } finally {
      setCarregando(false)
    }
  }

  function formatarData(data) {
    if (!data) return ''

    const dataISO = new Date(data)
    if (!Number.isNaN(dataISO.getTime())) {
      return dataISO.toLocaleDateString('pt-BR')
    }

    const [dataString] = String(data).split(' ')
    const partes = dataString.split('/')
    if (partes.length === 3) {
      const [dia, mes, ano] = partes
      const dataConvertida = new Date(`${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`)
      if (!Number.isNaN(dataConvertida.getTime())) {
        return dataConvertida.toLocaleDateString('pt-BR')
      }
    }

    return String(data)
  }

  function formatarValor(valor) {
    return valor.toFixed(2).replace('.', ',')
  }

  function renderizarEstrelas(nota) {
    return [1, 2, 3, 4, 5].map((value) => (
      <span key={value} className={value <= nota ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
        ★
      </span>
    ))
  }

  function abrirFormularioAvaliacao(compra) {
    const avaliacaoExistente = avaliacoes[compra.id_videoaula]
    setAvaliacaoForm({
      id_videoaula: compra.id_videoaula,
      id_avaliacao: avaliacaoExistente?.id_avaliacao || null,
      titulo: compra.titulo,
      nota: avaliacaoExistente?.nota || 5,
      comentario: avaliacaoExistente?.comentario || '',
    })
    setFormErro('')
    setFormAberto(true)
  }

  function fecharFormularioAvaliacao() {
    setFormAberto(false)
    setFormErro('')
    setAvaliacaoForm({
      id_videoaula: null,
      id_avaliacao: null,
      titulo: '',
      nota: 5,
      comentario: '',
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

      const payload = {
        id_aluno: Number(localStorage.getItem('idAluno') || 1),
        id_videoaula: avaliacaoForm.id_videoaula,
        nota: avaliacaoForm.nota,
        comentario: avaliacaoForm.comentario,
      }

      if (avaliacaoForm.id_avaliacao) {
        await api.updateReview(avaliacaoForm.id_avaliacao, payload)
      } else {
        await api.createReview(payload)
      }

      await buscarCompras()
      fecharFormularioAvaliacao()
    } catch (e) {
      setFormErro(e.message || 'Não foi possível salvar a avaliação.')
    } finally {
      setSalvandoAvaliacao(false)
    }
  }

  async function excluirAvaliacao(idAvaliacao, idVideoaula) {
    try {
      setRemovendoAvaliacao(true)
      await api.deleteReview(idAvaliacao)
      setAvaliacoes((current) => {
        const next = { ...current }
        delete next[idVideoaula]
        return next
      })
    } catch (e) {
      setErro(e.message || 'Não foi possível excluir a avaliação.')
    } finally {
      setRemovendoAvaliacao(false)
    }
  }

  function abrirDenuncia(compra) {
    setReportTargetId(compra.id_videoaula)
    setReportandoAula(true)
    setReportType('')
    setReportDetail('')
    setReportMessage('')
  }

  function cancelarDenuncia() {
    setReportTargetId(null)
    setReportandoAula(false)
    setReportType('')
    setReportDetail('')
    setReportMessage('')
  }

  function enviarDenuncia() {
    if (!reportType) {
      setReportMessage('Selecione o tipo de denúncia.')
      return
    }

    setReportMessage('Denúncia registrada. A equipe irá analisar.')
    setReportandoAula(false)
    setReportTargetId(null)
    setReportType('')
    setReportDetail('')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Minhas aulas</h1>

      <p className="mt-2 text-slate-600">
        Acompanhe as aulas adquiridas, abra o link e avalie o conteúdo.
      </p>

      {reportMessage && !reportandoAula && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          {reportMessage}
        </div>
      )}

      {carregando && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Carregando aulas...
        </div>
      )}

      {erro && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="font-semibold">Erro ao carregar aulas</p>
          <p className="text-sm">{erro}</p>
        </div>
      )}

      {!carregando && !erro && compras.length === 0 && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Você ainda não adquiriu nenhuma aula.
        </div>
      )}

      {!carregando && compras.length > 0 && (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {compras.map((compra) => {
            const avaliacaoAtual = avaliacoes[compra.id_videoaula]
            return (
              <Card key={compra.id_pagamento}>
                {compra.thumbnailUrl ? (
                  <img
                    src={compra.thumbnailUrl}
                    alt={compra.titulo}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="grid h-44 place-items-center rounded-t-xl bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-500">
                    <ImageIcon className="size-10" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{compra.titulo}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {compra.descricao || 'Sem descrição informada.'}
                      </CardDescription>
                    </div>
                    <Badge variant={compra.gratuito === 1 ? 'secondary' : 'outline'}>
                      {compra.gratuito === 1 ? 'Gratuita' : `R$ ${formatarValor(compra.precoOriginal)}`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      Professor: <span className="font-semibold text-slate-950">{compra.nomeProfessor}</span>
                    </p>
                    <p>
                      Comprado em: <span className="font-semibold text-slate-950">{formatarData(compra.dataPagamento)}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {compra.linkTumblr && compra.linkTumblr.toString().trim() !== '' ? (
                      <Button asChild variant="outline" className="w-full">
                        <a href={compra.linkTumblr} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                          <ExternalLink className="size-4" />
                          Abrir aula
                        </a>
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                        Link não disponível
                      </span>
                    )}

                    {avaliacaoAtual ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1 text-yellow-400">
                              {renderizarEstrelas(avaliacaoAtual.nota)}
                            </div>
                            <p className="mt-2 text-slate-900 font-semibold">Sua avaliação: {avaliacaoAtual.nota}/5</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => abrirFormularioAvaliacao(compra)}>
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => excluirAvaliacao(avaliacaoAtual.id_avaliacao, compra.id_videoaula)}
                              disabled={removendoAvaliacao}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                        {avaliacaoAtual.comentario && (
                          <p className="mt-3 text-slate-600">"{avaliacaoAtual.comentario}"</p>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => abrirFormularioAvaliacao(compra)}>
                        Avaliar aula
                      </Button>
                    )}
                    {reportandoAula && reportTargetId === compra.id_videoaula ? (
                      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        <div>
                          <Label htmlFor="report-type" className="mb-2 block text-sm font-medium text-slate-700">
                            Tipo de denúncia
                          </Label>
                          <select
                            id="report-type"
                            value={reportType}
                            onChange={(event) => setReportType(event.target.value)}
                            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                          >
                            <option value="">Selecione um tipo</option>
                            <option value="conteudo-inadequado">Conteúdo inadequado</option>
                            <option value="erro-na-aula">Erro na aula</option>
                            <option value="problema-tecnico">Problema técnico</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="report-detail" className="mb-2 block text-sm font-medium text-slate-700">
                            Detalhes (opcional)
                          </Label>
                          <Textarea
                            id="report-detail"
                            value={reportDetail}
                            onChange={(event) => setReportDetail(event.target.value)}
                            placeholder="Explique melhor se quiser"
                          />
                        </div>
                        {reportMessage && (
                          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-slate-900">
                            {reportMessage}
                          </div>
                        )}
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button onClick={enviarDenuncia}>Enviar denúncia</Button>
                          <Button variant="outline" onClick={cancelarDenuncia}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => abrirDenuncia(compra)}>
                        Denunciar aula
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={formAberto} onOpenChange={(open) => !open && fecharFormularioAvaliacao()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Avaliar aula</DialogTitle>
            <DialogDescription>
              Registre ou edite sua avaliação para a aula selecionada.
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
                {salvandoAvaliacao ? 'Salvando...' : avaliacaoForm.id_avaliacao ? 'Salvar alterações' : 'Enviar avaliação'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
