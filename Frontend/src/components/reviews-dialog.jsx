import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ReviewsDialog({ open, onOpenChange, idVideoLesson, title }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !idVideoLesson) return

    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const resp = await api.getVideoLessonReviews(idVideoLesson)
        if (mounted) setData(resp)
      } catch (e) {
        if (mounted) setError(e.message || 'Não foi possível carregar as avaliações.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [open, idVideoLesson])

  return (
    <Dialog open={Boolean(open)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Avaliações — {title}</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Média {Number(data.mediaNotas).toFixed(1).replace('.', ',')}</p>
                <p className="text-sm text-slate-500">{data.totalAvaliacoes} avaliações</p>
              </div>
            </div>

            {data.totalAvaliacoes === 0 && (
              <div className="mb-4 rounded-lg bg-slate-50 p-6 text-center text-slate-500">
                Esta videoaula ainda não recebeu avaliações.
              </div>
            )}

            {data.avaliacoes?.map((review) => (
              <article key={review.id_avaliacao} className="mb-3 rounded-lg border bg-slate-50 p-4 last:mb-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{review.nomeAluno}</p>
                  <div className="text-yellow-400">{'★'.repeat(review.nota)}</div>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{review.comentario || 'O aluno não deixou comentário.'}</p>
              </article>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ReviewsDialog
