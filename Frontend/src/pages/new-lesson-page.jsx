import { useNavigate } from 'react-router-dom'

import { LessonForm } from '@/components/lesson-form'
import { PageHeading } from '@/components/page-heading'
import { Card, CardContent } from '@/components/ui/card'
import { useProfessor } from '@/context/professor-context'

export function NewLessonPage() {
  const { idProfessor, apiClient, refresh } = useProfessor()
  const navigate = useNavigate()

  async function createLesson(data) {
    await apiClient.createVideoLesson(idProfessor, data)
    await refresh()
    navigate(`/professor/${idProfessor}/videoaulas`, {
      state: { success: 'Videoaula publicada com sucesso.' },
    })
  }

  return (
    <>
      <PageHeading
        title="Adicionar videoaula"
        description="Informe o conteúdo, escolha se o acesso será gratuito ou pago e defina o valor por aluno."
      />
      <Card className="max-w-3xl">
        <CardContent className="p-6 sm:p-8">
          <LessonForm
            submitLabel="Publicar videoaula"
            onSubmit={createLesson}
            onCancel={() => navigate(`/professor/${idProfessor}`)}
          />
        </CardContent>
      </Card>
    </>
  )
}
