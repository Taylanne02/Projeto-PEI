import { BookOpen, ShoppingBag, Star, User } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function DashboardAlunoPage() {
  const { idAluno } = useParams()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

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
          <h2 className="mt-2 text-2xl font-bold">0 cursos</h2>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-600">Compras realizadas</p>
          <h2 className="mt-2 text-2xl font-bold">0 compras</h2>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-600">Avaliações feitas</p>
          <h2 className="mt-2 text-2xl font-bold">0 avaliações</h2>
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
          <h3 className="font-semibold">Minhas compras</h3>
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