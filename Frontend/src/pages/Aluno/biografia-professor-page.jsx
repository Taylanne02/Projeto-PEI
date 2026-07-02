import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, GraduationCap, MapPin, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { api } from '@/services/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function BiografiaProfessorPage() {
  const { idAluno, idProfessor } = useParams()
  const [professor, setProfessor] = useState(null)
  const [videoaulas, setVideoaulas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let active = true

    api
      .getProfessorProfile(idProfessor)
      .then((response) => {
        if (!active) return

        setProfessor(response.professor)
        setVideoaulas(response.videoaulas || [])
        setErro('')
      })
      .catch((e) => {
        if (!active) return

        setErro(e.message || 'Nao foi possivel carregar a biografia do professor.')
      })
      .finally(() => {
        if (!active) return

        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [idProfessor])

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-slate-600">
        Carregando biografia...
      </div>
    )
  }

  if (erro) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">Erro ao carregar professor</p>
        <p className="mt-1 text-sm">{erro}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to={`/aluno/${idAluno}/cursos`}>Voltar para cursos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button asChild variant="outline">
        <Link to={`/aluno/${idAluno}/cursos`}>
          <ArrowLeft className="size-4" />
          Voltar para cursos
        </Link>
      </Button>

      <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {professor?.foto ? (
            <img
              src={`${API_URL}/${professor.foto}`}
              alt={`Foto de ${professor.nome}`}
              className="size-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
              <User className="size-8" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-indigo-700">Professor</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              {professor?.nome}
            </h1>

            <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <GraduationCap className="mt-0.5 size-4 text-slate-500" />
                <span>
                  <span className="block font-medium text-slate-950">Faculdade</span>
                  {professor?.faculdade || 'Nao informado'}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 size-4 text-slate-500" />
                <span>
                  <span className="block font-medium text-slate-950">Nascimento</span>
                  {professor?.dataNascimento || 'Nao informado'}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-slate-500" />
                <span>
                  <span className="block font-medium text-slate-950">Cidade</span>
                  {professor?.cidade || 'Nao informado'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-950">Descricao</h2>
              <p className="mt-2 whitespace-pre-line text-slate-700">
                {professor?.biografia || 'Este professor ainda nao adicionou uma descricao.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-slate-950">Videoaulas deste professor</h2>

        {videoaulas.length === 0 ? (
          <div className="mt-3 rounded-xl border bg-white p-6 text-sm text-slate-600">
            Nenhuma videoaula publicada no momento.
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {videoaulas.map((videoaula) => (
              <div key={videoaula.id_videoaula} className="rounded-xl border bg-white p-4">
                <h3 className="font-semibold text-slate-950">{videoaula.titulo}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {videoaula.descricao || 'Sem descricao informada.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
