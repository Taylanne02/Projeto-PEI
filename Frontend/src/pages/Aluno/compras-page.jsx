import { useState, useEffect } from 'react'
import { api } from '../../services/api'

export function ComprasPage() {
  const [compras, setCompras] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    buscarCompras()
  }, [])

  async function buscarCompras() {
    try {
      setCarregando(true)
      setErro(null)

      // Pega o ID do aluno do localStorage
      const idAluno = localStorage.getItem('idAluno') || 1

      const dados = await api.getStudentPurchases(idAluno)
      setCompras(dados.compras || [])
    } catch (e) {
      setErro(e.message || 'Erro ao carregar compras')
      setCompras([])
    } finally {
      setCarregando(false)
    }
  }

  function formatarData(data) {
    if (!data) return ''
    const d = new Date(data)
    return d.toLocaleDateString('pt-BR')
  }

  function formatarValor(valor) {
    return valor.toFixed(2).replace('.', ',')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Minhas compras</h1>

      <p className="mt-2 text-slate-600">
        Acompanhe o histórico de videoaulas adquiridas.
      </p>

      {carregando && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Carregando compras...
        </div>
      )}

      {erro && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="font-semibold">Erro ao carregar compras</p>
          <p className="text-sm">{erro}</p>
        </div>
      )}

      {!carregando && !erro && compras.length === 0 && (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-600">
          Você ainda não realizou nenhuma compra.
        </div>
      )}

      {!carregando && compras.length > 0 && (
        <div className="mt-8 space-y-4">
          {compras.map((compra) => (
            <div
              key={compra.id_pagamento}
              className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4 p-4">
                {compra.thumbnailUrl && (
                  <img
                    src={compra.thumbnailUrl}
                    alt={compra.titulo}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-bold text-slate-950 line-clamp-1">
                    {compra.titulo}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                    {compra.descricao}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Professor: <span className="font-semibold">{compra.nomeProfessor}</span>
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Comprado em: <span className="font-semibold">{formatarData(compra.dataPagamento)}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-950">
                      R$ {formatarValor(compra.valor)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}