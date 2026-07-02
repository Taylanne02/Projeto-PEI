import {
  BookOpen,
  GraduationCap,
  House,
  LogOut,
  ShoppingBag,
  Star,
  User,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useUser } from '@/contexts/user-context'

const navigation = [
  { label: 'Início', path: '', icon: House, end: true },
  { label: 'Cursos', path: 'cursos', icon: BookOpen },
  { label: 'Minhas aulas', path: 'aulas', icon: ShoppingBag },
  { label: 'Avaliações', path: 'avaliacoes', icon: Star },
  { label: 'Meu perfil', path: 'perfil', icon: User },
]

export function AlunoLayout() {
  const navigate = useNavigate()
  const { idAluno } = useParams()

  const { usuario, setUsuario } = useUser()

  const basePath = `/aluno/${idAluno}`

  function handleLogout() {
    setUsuario(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink
            to={basePath}
            className="flex items-center gap-3 font-semibold text-slate-950"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <GraduationCap className="size-5" />
            </span>

            <span>
              <span className="block text-sm text-indigo-600">NextWork</span>
              <span className="block text-base">Painel do aluno</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-sm font-semibold text-slate-900">
                {usuario?.nome || `Aluno #${idAluno}`}
              </span>
              <span className="block text-xs text-slate-500">Aluno</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b bg-white" aria-label="Navegação do aluno">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {navigation.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path ? `${basePath}/${path}` : basePath}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:text-slate-950',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}