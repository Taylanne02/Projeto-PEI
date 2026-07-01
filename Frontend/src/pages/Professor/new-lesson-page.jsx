import { useNavigate, useParams } from 'react-router-dom'

import { LessonForm } from '@/components/lesson-form'
import { PageHeading } from '@/components/page-heading'
import { Card, CardContent } from '@/components/ui/card'
import { DataError, DataLoading } from '@/components/data-state'
import { api } from '@/services/api'
import { useProfessorData } from '@/hooks/use-professor-data'

export function NewLessonPage() {
  const { idProfessor } = useParams()
  const navigate = useNavigate()
  const { professor, loading, error, refresh } = useProfessorData(idProfessor, {
    profile: true,
  })

  async function createLesson(data) {
    await api.createVideoLesson(idProfessor, data)
    navigate(`/professor/${idProfessor}/videoaulas`, {
      state: { success: 'Videoaula publicada com sucesso.' },
    })
  }

  if (loading) {
    return <DataLoading />
  }

  if (error) {
    return <DataError error={error} onRetry={refresh} />
  }

  const canPublishPaid = professor?.statusValidacao !== 'pendente'

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
            canPublishPaid={canPublishPaid}
          />
        </CardContent>
      </Card>
    </>
  )
}
