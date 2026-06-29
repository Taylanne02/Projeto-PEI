import { useState, useEffect } from 'react'
import { api } from '../../services/api'

export function AvaliacoesAlunoPage() {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}