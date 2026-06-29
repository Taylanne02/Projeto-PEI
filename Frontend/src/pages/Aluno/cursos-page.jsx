import { useState, useEffect } from 'react'
import { api } from '../../services/api'

export function CursosPage() {
  const [cursos, setCursos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    buscarCursos()
  }, [])

  async function buscarCursos() {
    try {
      setCarregando(true)
      setErro(null)
      const dados = await api.getAllVideoLessons()
      setCursos(dados.videoaulas || [])
    } catch (e) {
      setErro(e.message || 'Erro ao carregar cursos')
      setCursos([])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Cursos disponíveis</h1>

      <p className="mt-2 text-slate-600">
        Encontre videoaulas práticas sobre finanças, carreira, documentação e direitos.
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
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
            <div
              key={curso.id_videoaula}
              className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              {curso.thumbnailUrl && (
                <img
                  src={curso.thumbnailUrl}
                  alt={curso.titulo}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="font-bold text-slate-950 line-clamp-2">
                  {curso.titulo}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {curso.descricao}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  Professor: <span className="font-semibold">{curso.nomeProfessor}</span>
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    {curso.gratuito === 1 ? (
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        Gratuito
                      </span>
                    ) : (
                      <p className="text-xl font-bold text-slate-950">
                        R$ {curso.valor.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Ver curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}