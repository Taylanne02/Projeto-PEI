import {
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  House,
  MessageSquareText,
  Plus,
} from 'lucide-react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

import { cn } from '@/lib/utils'

const navigation = [
  { label: 'Início', path: '', icon: House, end: true },
  { label: 'Adicionar', path: 'videoaulas/nova', icon: Plus },
  { label: 'Videoaulas', path: 'videoaulas', icon: BookOpen },
  { label: 'Avaliações', path: 'avaliacoes', icon: MessageSquareText },
  { label: 'Financeiro', path: 'financeiro', icon: CircleDollarSign },
]

export function ProfessorLayout() {
  const { idProfessor } = useParams()
  const basePath = `/professor/${idProfessor}`

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
              <span className="block text-sm text-indigo-600">PEI Ensino</span>
              <span className="block text-base">Painel do professor</span>
            </span>
          </NavLink>
          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            Professor #{idProfessor}
          </span>
        </div>
      </header>

      <nav className="border-b bg-white" aria-label="Navegação do professor">
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
