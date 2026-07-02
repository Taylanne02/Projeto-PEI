import { useState, useEffect } from 'react'
import { ExternalLink, ImageIcon, ShoppingBag } from 'lucide-react'
import { api } from '../../services/api'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function LessonThumbnail({ thumbnailUrl, titulo }) {
  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={`Thumbnail de ${titulo}`}
        className="h-44 w-full object-cover"
      />
    )
  }

  return (
    <div className="grid h-44 place-items-center rounded-t-xl bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-500">
      <ImageIcon className="size-10" />
    </div>
  )
}

export function CursosPage() {
  const [cursos, setCursos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [cursoSelecionado, setCursoSelecionado] = useState(null)
  const [linkVisivel, setLinkVisivel] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportType, setReportType] = useState('')
  const [reportDetail, setReportDetail] = useState('')
  const [carregandoCompra, setCarregandoCompra] = useState(false)
  const [comprasIds, setComprasIds] = useState(new Set())

  const [pagamentoAberto, setPagamentoAberto] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState('')
  const [erroPagamento, setErroPagamento] = useState('')

  useEffect(() => {
    buscarCursos()
  }, [])

  async function buscarCursos() {
    try {
      setCarregando(true)
      setErro(null)

      const idAluno = Number(localStorage.getItem('idAluno') || 1)

      const [dados, comprasDados] = await Promise.all([
        api.getAllVideoLessons(),
        api.getStudentPurchases(idAluno),
      ])

      setCursos(dados.videoaulas || [])
      setComprasIds(
        new Set((comprasDados.compras || []).map((item) => item.id_videoaula)),
      )
    } catch (e) {
      setErro(e.message || 'Erro ao carregar cursos')
      setCursos([])
      setComprasIds(new Set())
    } finally {
      setCarregando(false)
    }
  }

  async function adquirirAula() {
    if (!cursoSelecionado) return

    try {
      setCarregandoCompra(true)
      setMensagem('')

      const idAluno = Number(localStorage.getItem('idAluno') || 1)

      await api.buyVideoLesson(
        idAluno,
        cursoSelecionado.id_videoaula,
        formaPagamento || 'gratuito',
      )

      setComprasIds((comprasAtuais) => {
        const novasCompras = new Set(comprasAtuais)
        novasCompras.add(cursoSelecionado.id_videoaula)
        return novasCompras
      })

      setLinkVisivel(true)
      setMensagem('Aula adquirida! O link agora está disponível.')
    } catch (e) {
      if (e.status === 400) {
        setLinkVisivel(true)
        setMensagem('Aula já adquirida. O link está disponível abaixo.')
      } else {
        setMensagem(e.message || 'Não foi possível adquirir a aula.')
      }
    } finally {
      setCarregandoCompra(false)
    }
  }

  async function confirmarPagamento() {
    if (!formaPagamento) {
      setErroPagamento('Escolha uma forma de pagamento.')
      return
    }

    setErroPagamento('')
    await adquirirAula()

    setPagamentoAberto(false)
    setFormaPagamento('')
  }

  function abrirModal(curso) {
    setCursoSelecionado(curso)
    setLinkVisivel(false)
    setMensagem('')
    setShowReportForm(false)
    setReportType('')
    setReportDetail('')
    setPagamentoAberto(false)
    setFormaPagamento('')
    setErroPagamento('')
  }

  function fecharModal() {
    setCursoSelecionado(null)
    setLinkVisivel(false)
    setMensagem('')
    setShowReportForm(false)
    setReportType('')
    setReportDetail('')
    setPagamentoAberto(false)
    setFormaPagamento('')
    setErroPagamento('')
  }

  function denunciarAula() {
    setShowReportForm(true)
    setMensagem('')
  }

  function enviarDenuncia() {
    if (!reportType) {
      setMensagem('Selecione o tipo de denúncia.')
      return
    }

    setMensagem('Denúncia registrada. A equipe irá analisar.')
    setShowReportForm(false)
    setReportType('')
    setReportDetail('')
  }

  const aulaJaAdquirida =
    cursoSelecionado && comprasIds.has(cursoSelecionado.id_videoaula)

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Cursos disponíveis</h1>

      <p className="mt-2 text-slate-600">
        Encontre videoaulas práticas sobre finanças, carreira, documentação e
        direitos.
      </p>

      {carregando && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Carregando cursos...
        </div>
      )}

      {erro && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="font-semibold">Erro ao carregar cursos</p>
          <p className="text-sm">{erro}</p>
        </div>
      )}

      {!carregando && !erro && cursos.length === 0 && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Nenhum curso disponível no momento.
        </div>
      )}

      {!carregando && cursos.length > 0 && (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {cursos.map((curso) => (
            <Card key={curso.id_videoaula}>
              <button
                type="button"
                className="group/card flex h-full w-full flex-col text-left"
                onClick={() => abrirModal(curso)}
              >
                <LessonThumbnail
                  thumbnailUrl={curso.thumbnailUrl}
                  titulo={curso.titulo}
                />

                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{curso.titulo}</CardTitle>

                      <CardDescription className="mt-2 line-clamp-2">
                        {curso.descricao || 'Sem descrição informada.'}
                      </CardDescription>

                      {comprasIds.has(curso.id_videoaula) && (
                        <p className="mt-2 text-sm text-emerald-700">
                          Você já adquiriu esta aula.
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {curso.gratuito === 1
                        ? 'Gratuita'
                        : `R$ ${curso.valor.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <ShoppingBag className="size-4" />
                    <span>
                      Professor:{' '}
                      <span className="font-semibold text-slate-950">
                        {curso.nomeProfessor}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                    Ver detalhes
                  </div>
                </CardContent>
              </button>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(cursoSelecionado)}
        onOpenChange={(open) => !open && fecharModal()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{cursoSelecionado?.titulo}</DialogTitle>
            <DialogDescription>
              {cursoSelecionado?.descricao || 'Sem descrição informada.'}
            </DialogDescription>
          </DialogHeader>

          {cursoSelecionado && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-600">Professor</p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {cursoSelecionado.nomeProfessor}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Valor</p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {cursoSelecionado.gratuito === 1
                      ? 'Gratuita'
                      : `R$ ${cursoSelecionado.valor
                          .toFixed(2)
                          .replace('.', ',')}`}
                  </p>
                </div>
              </div>

              {!linkVisivel && !aulaJaAdquirida && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {cursoSelecionado.gratuito === 1
                    ? 'Esta aula é gratuita. Clique em adquirir para liberar o link.'
                    : 'Esta aula é paga. Finalize o pagamento para liberar o link.'}
                </div>
              )}

              {mensagem && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-slate-900">
                  {mensagem}
                </div>
              )}

              {(linkVisivel || aulaJaAdquirida) && cursoSelecionado.linkTumblr && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <a
                    href={cursoSelecionado.linkTumblr}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
                  >
                    <ExternalLink className="size-4" />
                    Abrir link da aula
                  </a>
                </div>
              )}

              {showReportForm ? (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <Label
                      htmlFor="report-type"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Tipo de denúncia
                    </Label>

                    <select
                      id="report-type"
                      value={reportType}
                      onChange={(event) => setReportType(event.target.value)}
                      className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="conteudo-inadequado">
                        Conteúdo inadequado
                      </option>
                      <option value="erro-na-aula">Erro na aula</option>
                      <option value="problema-tecnico">
                        Problema técnico
                      </option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="report-detail"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Detalhes opcional
                    </Label>

                    <Textarea
                      id="report-detail"
                      value={reportDetail}
                      onChange={(event) => setReportDetail(event.target.value)}
                      placeholder="Explique melhor se quiser"
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={enviarDenuncia}>Enviar denúncia</Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowReportForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  {cursoSelecionado.gratuito === 1 ? (
                    <Button
                      onClick={adquirirAula}
                      disabled={carregandoCompra || linkVisivel || aulaJaAdquirida}
                    >
                      {aulaJaAdquirida
                        ? 'Já adquirido'
                        : linkVisivel
                        ? 'Aula adquirida'
                        : 'Adquirir aula gratuita'}
                    </Button>
                  ) : aulaJaAdquirida || linkVisivel ? (
                    <Button disabled>Já adquirido</Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setPagamentoAberto(true)
                        setErroPagamento('')
                      }}
                      disabled={carregandoCompra}
                    >
                      Finalizar pagamento
                    </Button>
                  )}

                  <Button variant="outline" onClick={denunciarAula}>
                    Denúncia
                  </Button>

                  <DialogClose asChild>
                    <Button variant="secondary">Fechar</Button>
                  </DialogClose>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={pagamentoAberto} onOpenChange={setPagamentoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar pagamento</DialogTitle>
            <DialogDescription>
              Escolha uma forma de pagamento para liberar o acesso à videoaula.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Valor da aula</Label>

              <div className="mt-2 rounded-lg border bg-slate-50 px-3 py-2 font-semibold text-slate-950">
                R${' '}
                {cursoSelecionado?.valor
                  ?.toFixed(2)
                  .replace('.', ',')}
              </div>
            </div>

            <div>
              <Label>Forma de pagamento</Label>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {['Pix', 'Visa', 'Mastercard', 'PayPal', 'Crédito', 'Débito'].map(
                  (forma) => (
                    <button
                      key={forma}
                      type="button"
                      onClick={() => setFormaPagamento(forma)}
                      className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                        formaPagamento === forma
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {forma}
                    </button>
                  ),
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Esta etapa é apenas demonstrativa e não realiza cobrança real.
            </p>

            {erroPagamento && (
              <p className="text-sm text-red-600">{erroPagamento}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPagamentoAberto(false)
                  setFormaPagamento('')
                  setErroPagamento('')
                }}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={confirmarPagamento}
                disabled={carregandoCompra}
              >
                {carregandoCompra ? 'Processando...' : 'Confirmar pagamento'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}