import { Route, Routes } from 'react-router-dom'

import { ProfessorLayout } from '@/components/professor-layout'

import { DashboardPage } from '@/pages/Professor/dashboard-page'
import { FinancePage } from '@/pages/Professor/finance-page'
import { LessonsPage } from '@/pages/Professor/lessons-page'
import { NewLessonPage } from '@/pages/Professor/new-lesson-page'
import { ReviewsPage } from '@/pages/Professor/reviews-page'

import Home from '@/pages/Home/Home'
import Login from '@/pages/Login/Login'
import Cadastro from '@/pages/Cadastro/Cadastro'

import { NotFoundPage } from '@/pages/not-found-page'

export function AppRoutes() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Área do Professor */}
      <Route path="/professor/:idProfessor" element={<ProfessorLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="videoaulas/nova" element={<NewLessonPage />} />
        <Route path="videoaulas" element={<LessonsPage />} />
        <Route path="avaliacoes" element={<ReviewsPage />} />
        <Route path="financeiro" element={<FinancePage />} />
      </Route>

      {/* Página não encontrada */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}