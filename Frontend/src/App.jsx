import { Route, Routes } from 'react-router-dom'

import { ProfessorLayout } from '@/components/professor-layout'
import { AlunoLayout } from '@/components/ui/aluno-layout'

import { DashboardPage } from '@/pages/Professor/dashboard-page'
import { FinancePage } from '@/pages/Professor/finance-page'
import { LessonsPage } from '@/pages/Professor/lessons-page'
import { NewLessonPage } from '@/pages/Professor/new-lesson-page'
import { ReviewsPage } from '@/pages/Professor/reviews-page'

import { DashboardAlunoPage } from '@/pages/Aluno/dashboard-aluno-page'
import { CursosPage } from '@/pages/Aluno/cursos-page'
import { ComprasPage } from '@/pages/Aluno/compras-page'
import { AvaliacoesAlunoPage } from '@/pages/Aluno/avaliacoes-aluno-page'
import { PerfilAlunoPage } from '@/pages/Aluno/perfil-aluno-page'

import Home from '@/pages/Home/Home'
import Login from '@/pages/Login/Login'
import Cadastro from '@/pages/Cadastro/Cadastro'

import { NotFoundPage } from '@/pages/not-found-page'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/professor/:idProfessor" element={<ProfessorLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="videoaulas/nova" element={<NewLessonPage />} />
        <Route path="videoaulas" element={<LessonsPage />} />
        <Route path="avaliacoes" element={<ReviewsPage />} />
        <Route path="financeiro" element={<FinancePage />} />
      </Route>

      <Route path="/aluno/:idAluno" element={<AlunoLayout />}>
        <Route index element={<DashboardAlunoPage />} />
        <Route path="cursos" element={<CursosPage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="avaliacoes" element={<AvaliacoesAlunoPage />} />
        <Route path="perfil" element={<PerfilAlunoPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}