import { MessageSquareText, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { DataError, DataLoading } from '@/components/data-state'
import { PageHeading } from '@/components/page-heading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfessorData } from '@/hooks/use-professor-data'
import { formatSales } from '@/lib/format'
import { api } from '@/services/api'

function RatingStars({ rating }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`size-4 ${
            index < rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-300'
          }`}
        />
      ))}
    </span>
  )
}

export function ReviewsPage() {
  const { idProfessor } = useParams()
  const { lessons, loading, error, refresh } = useProfessorData(idProfessor)
  const [reviewsByLesson, setReviewsByLesson] = useState({})
  const [loadingLesson, setLoadingLesson] = useState(null)
  const [errorByLesson, setErrorByLesson] = useState({})

  async function loadReviews(value) {
    if (!value || reviewsByLesson[value]) return

    const idVideoLesson = Number(value)
    setLoadingLesson(idVideoLesson)

    try {
      const response = await api.getVideoLessonReviews(idVideoLesson)
      setReviewsByLesson((current) => ({
        ...current,
        [idVideoLesson]: response,
      }))
    } catch (error) {
      setErrorByLesson((current) => ({
        ...current,
        [idVideoLesson]:
          error.message || 'Não foi possível carregar as avaliações.',
      }))
    } finally {
      setLoadingLesson(null)
    }
  }

  if (loading) return <DataLoading />
  if (error) return <DataError error={error} onRetry={refresh} />

  return (
    <>
      <PageHeading
        title="Avaliações e desempenho"
        description="Abra uma videoaula para consultar a média, os comentários dos alunos e o volume de vendas."
      />

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center text-slate-500">
            Cadastre uma videoaula para começar a receber avaliações.
          </CardContent>
        </Card>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          onValueChange={loadReviews}
        >
          {lessons.map((lesson) => {
            const reviewData = reviewsByLesson[lesson.id_videoaula]
            const error = errorByLesson[lesson.id_videoaula]

            return (
              <AccordionItem
                key={lesson.id_videoaula}
                value={String(lesson.id_videoaula)}
                className="rounded-xl border bg-white px-5 shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {lesson.titulo}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="size-4" />
                          {formatSales(lesson.totalVendas)}
                        </span>
                        <Badge variant={lesson.gratuito ? 'secondary' : 'outline'}>
                          {lesson.gratuito ? 'Gratuita' : 'Paga'}
                        </Badge>
                      </div>
                    </div>
                    {reviewData && reviewData.totalAvaliacoes > 0 && (
                      <div className="mr-3 text-right">
                        <p className="font-semibold text-slate-900">
                          Média{' '}
                          {Number(reviewData.mediaNotas)
                            .toFixed(1)
                            .replace('.', ',')}
                        </p>
                        <p className="text-xs text-slate-500">
                          {reviewData.totalAvaliacoes} avaliações
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {loadingLesson === lesson.id_videoaula && (
                    <div className="space-y-3 pb-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {reviewData?.totalAvaliacoes === 0 && (
                    <div className="mb-4 rounded-lg bg-slate-50 p-6 text-center text-slate-500">
                      <MessageSquareText className="mx-auto mb-2 size-6" />
                      Esta videoaula ainda não recebeu avaliações.
                    </div>
                  )}

                  {reviewData?.avaliacoes?.map((review) => (
                    <article
                      key={review.id_avaliacao}
                      className="mb-3 rounded-lg border bg-slate-50 p-4 last:mb-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {review.nomeAluno}
                        </p>
                        <RatingStars rating={review.nota} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {review.comentario || 'O aluno não deixou comentário.'}
                      </p>
                    </article>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </>
  )
}
