import { Navigate, Route, Routes } from 'react-router-dom'

import { ProfessorLayout } from '@/components/professor-layout'
import { DashboardPage } from '@/pages/dashboard-page'
import { FinancePage } from '@/pages/finance-page'
import { LessonsPage } from '@/pages/lessons-page'
import { NewLessonPage } from '@/pages/new-lesson-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { ReviewsPage } from '@/pages/reviews-page'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/professor/1" replace />} />
      <Route path="/professor/:idProfessor" element={<ProfessorLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="videoaulas/nova" element={<NewLessonPage />} />
        <Route path="videoaulas" element={<LessonsPage />} />
        <Route path="avaliacoes" element={<ReviewsPage />} />
        <Route path="financeiro" element={<FinancePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
