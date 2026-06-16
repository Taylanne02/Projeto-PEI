import { Route, Routes } from 'react-router-dom'

import { ProfessorLayout } from '@/components/professor-layout'
import { DashboardPage } from '@/pages/Professor/dashboard-page'
import { FinancePage } from '@/pages/Professor/finance-page'
import { LessonsPage } from '@/pages/Professor/lessons-page'
import { NewLessonPage } from '@/pages/Professor/new-lesson-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { StartPage } from '@/pages/start-page'
import { ReviewsPage } from '@/pages/Professor/reviews-page'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
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
