import { useState, useEffect } from 'react'
import { BookOpen, ShoppingBag, Star, User } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import { useUser } from '@/contexts/user-context'

export function DashboardAlunoPage() {
  const { idAluno } = useParams()
  const { usuario } = useUser()
  const [stats, setStats] = useState({
    totalCursos: 0,
    totalCompras: 0,
    totalAvaliacoes: 0,
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarDados()
  }, [])

  async function buscarDados() {
    try {
      setCarregando(true)

      // Pega o ID do aluno do localStorage se não tiver nos params
      const alunoId = idAluno || localStorage.getItem('idAluno') || 1

      // Busca todos os cursos
      const cursos = await api.getAllVideoLessons()
      
      // Busca compras do aluno
      const compras = await api.getStudentPurchases(alunoId)
      
      // Busca avaliações do aluno
      const avaliacoes = await api.getStudentReviews(alunoId)

      setStats({
        totalCursos: cursos.total || 0,
        totalCompras: compras.total || 0,
        totalAvaliacoes: avaliacoes.total || 0,
      })
    } catch (e) {
      console.error('Erro ao buscar dados:', e)
      setStats({
        totalCursos: 0,
        totalCompras: 0,
        totalAvaliacoes: 0,
      })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">
        Olá, {usuario?.nome || 'aluno'}
      </h1>

      <p className="mt-2 text-slate-600">
        Explore cursos, acompanhe suas compras e avalie os conteúdos assistidos.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-600">Cursos disponíveis</p>
          <h2 className="mt-2 text-2xl font-bold">
            {carregando ? '...' : stats.totalCursos} curso{stats.totalCursos !== 1 ? 's' : ''}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-600">Cursos adquiridos</p>
          <h2 className="mt-2 text-2xl font-bold">
            {carregando ? '...' : stats.totalCompras} compra{stats.totalCompras !== 1 ? 's' : ''}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-600">Avaliações feitas</p>
          <h2 className="mt-2 text-2xl font-bold">
            {carregando ? '...' : stats.totalAvaliacoes} avaliação{stats.totalAvaliacoes !== 1 ? 'ões' : ''}
          </h2>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-950">
        O que você deseja fazer?
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Link
          to={`/aluno/${idAluno}/cursos`}
          className="rounded-xl border bg-white p-5 transition hover:border-indigo-600"
        >
          <BookOpen className="mb-4 text-indigo-600" />
          <h3 className="font-semibold">Explorar cursos</h3>
          <p className="mt-1 text-sm text-slate-600">
            Veja videoaulas gratuitas e pagas disponíveis na plataforma.
          </p>
        </Link>

        <Link
          to={`/aluno/${idAluno}/compras`}
          className="rounded-xl border bg-white p-5 transition hover:border-indigo-600"
        >
          <ShoppingBag className="mb-4 text-indigo-600" />
          <h3 className="font-semibold">Minhas aulas</h3>
          <p className="mt-1 text-sm text-slate-600">
            Acompanhe os cursos adquiridos e continue seus estudos.
          </p>
        </Link>

        <Link
          to={`/aluno/${idAluno}/avaliacoes`}
          className="rounded-xl border bg-white p-5 transition hover:border-indigo-600"
        >
          <Star className="mb-4 text-indigo-600" />
          <h3 className="font-semibold">Avaliar aulas</h3>
          <p className="mt-1 text-sm text-slate-600">
            Registre sua opinião sobre os conteúdos assistidos.
          </p>
        </Link>

        <Link
          to={`/aluno/${idAluno}/perfil`}
          className="rounded-xl border bg-white p-5 transition hover:border-indigo-600"
        >
          <User className="mb-4 text-indigo-600" />
          <h3 className="font-semibold">Meu perfil</h3>
          <p className="mt-1 text-sm text-slate-600">
            Visualize suas informações pessoais cadastradas.
          </p>
        </Link>
      </div>
    </div>
  )
}