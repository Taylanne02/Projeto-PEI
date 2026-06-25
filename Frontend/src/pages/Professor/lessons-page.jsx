import { ExternalLink, ImageIcon, Pencil, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { DataError, DataLoading } from '@/components/data-state'
import { LessonForm } from '@/components/lesson-form'
import { PageHeading } from '@/components/page-heading'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProfessorData } from '@/hooks/use-professor-data'
import { formatSales } from '@/lib/format'
import { api } from '@/services/api'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function LessonThumbnail({ lesson }) {
  if (lesson.thumbnailUrl) {
    return (
      <img
        src={lesson.thumbnailUrl}
        alt={`Thumbnail de ${lesson.titulo}`}
        className="h-36 w-full rounded-t-xl object-cover"
      />
    )
  }

  return (
    <div className="grid h-36 place-items-center rounded-t-xl bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-500">
      <ImageIcon className="size-10" />
    </div>
  )
}

export function LessonsPage() {
  const { idProfessor } = useParams()
  const { lessons, loading, error: loadError, refresh } =
    useProfessorData(idProfessor)
  const location = useLocation()
  const [editingLesson, setEditingLesson] = useState(null)
  const [deletingLesson, setDeletingLesson] = useState(null)
  const [error, setError] = useState('')
  const orderedLessons = [...lessons].sort(
    (first, second) => second.id_videoaula - first.id_videoaula,
  )

  async function updateLesson(data) {
    await api.updateVideoLesson(editingLesson.id_videoaula, data)
    await refresh()
    setEditingLesson(null)
  }

  async function deleteLesson() {
    try {
      await api.deleteVideoLesson(deletingLesson.id_videoaula)
      await refresh()
      setDeletingLesson(null)
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível excluir a videoaula.')
      setDeletingLesson(null)
    }
  }

  if (loading) return <DataLoading />
  if (loadError) return <DataError error={loadError} onRetry={refresh} />

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <PageHeading
          title="Gerenciar videoaulas"
          description="Edite informações, valores ou remova videoaulas cadastradas."
        />
        <Button asChild>
          <Link to={`/professor/${idProfessor}/videoaulas/nova`}>
            <Plus />
            Nova videoaula
          </Link>
        </Button>
      </div>

      {location.state?.success && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-900">
          <AlertDescription>{location.state.success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {orderedLessons.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <CardTitle>Nenhuma videoaula cadastrada</CardTitle>
            <CardDescription className="mt-2">
              Publique seu primeiro conteúdo para começar a receber alunos.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {orderedLessons.map((lesson) => (
            <Card key={lesson.id_videoaula} data-testid="managed-lesson">
              <LessonThumbnail lesson={lesson} />
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{lesson.titulo}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {lesson.descricao || 'Sem descrição informada.'}
                    </CardDescription>
                  </div>
                  <Badge variant={lesson.gratuito ? 'secondary' : 'outline'}>
                    {lesson.gratuito
                      ? 'Gratuita'
                      : currency.format(lesson.valor)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ShoppingBag className="size-4" />
                  {formatSales(lesson.totalVendas)}
                </div>
                {lesson.linkTumblr && (
                  <Button asChild variant="link" className="mt-3 h-auto p-0">
                    <a
                      href={lesson.linkTumblr}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      Abrir link do Tumblr
                    </a>
                  </Button>
                )}
                <div className="mt-5 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingLesson(lesson)}
                    aria-label={`Editar ${lesson.titulo}`}
                  >
                    <Pencil />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeletingLesson(lesson)}
                    aria-label={`Excluir ${lesson.titulo}`}
                  >
                    <Trash2 />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(editingLesson)}
        onOpenChange={(open) => !open && setEditingLesson(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar videoaula</DialogTitle>
            <DialogDescription>
              Atualize as informações exibidas para os alunos.
            </DialogDescription>
          </DialogHeader>
          {editingLesson && (
            <LessonForm
              initialValues={editingLesson}
              submitLabel="Salvar alterações"
              onSubmit={updateLesson}
              onCancel={() => setEditingLesson(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deletingLesson)}
        onOpenChange={(open) => !open && setDeletingLesson(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir videoaula?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá “{deletingLesson?.titulo}” permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={deleteLesson}
            >
              Confirmar exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
