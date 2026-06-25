import {
  ArrowRight,
  BookOpen,
  CircleDollarSign,
  ImageIcon,
  MessageSquareText,
  Plus,
  ShoppingBag,
  Video,
  WalletCards,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { PageHeading } from '@/components/page-heading'
import { DataError, DataLoading } from '@/components/data-state'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useProfessorData } from '@/hooks/use-professor-data'
import { formatSales } from '@/lib/format'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const actions = [
  {
    title: 'Adicionar videoaula',
    description: 'Publique uma aula gratuita ou defina o valor por aluno.',
    path: 'videoaulas/nova',
    icon: Plus,
  },
  {
    title: 'Gerenciar videoaulas',
    description: 'Edite informações, valores ou remova conteúdos.',
    path: 'videoaulas',
    icon: BookOpen,
  },
  {
    title: 'Avaliações e desempenho',
    description: 'Consulte notas, comentários e vendas por aula.',
    path: 'avaliacoes',
    icon: MessageSquareText,
  },
  {
    title: 'Financeiro',
    description: 'Acompanhe o faturamento bruto e sua comissão.',
    path: 'financeiro',
    icon: CircleDollarSign,
  },
]

function StatCard({ label, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        <span className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon className="size-6" />
        </span>
      </CardContent>
    </Card>
  )
}

function LessonPreviewThumbnail({ lesson }) {
  if (lesson.thumbnailUrl) {
    return (
      <img
        src={lesson.thumbnailUrl}
        alt={`Thumbnail de ${lesson.titulo}`}
        className="size-16 rounded-xl object-cover"
      />
    )
  }

  return (
    <span className="grid size-16 place-items-center rounded-xl bg-indigo-50 text-indigo-500">
      <ImageIcon className="size-6" />
    </span>
  )
}

export function DashboardPage() {
  const { idProfessor } = useParams()
  const {
    professor,
    commissionBalance,
    totalSales,
    lessons,
    loading,
    error,
    refresh,
  } = useProfessorData(idProfessor, { profile: true })

  if (loading) return <DataLoading />
  if (error) return <DataError error={error} onRetry={refresh} />

  const basePath = `/professor/${idProfessor}`
  const topLessons = [...lessons]
    .sort((first, second) => second.totalVendas - first.totalVendas)
    .slice(0, 3)

  return (
    <>
      <PageHeading
        title={`Olá, ${professor.nome}`}
        description="Acompanhe seus resultados e acesse as principais áreas do painel."
      />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Indicadores">
        <StatCard
          label="Saldo de comissão"
          value={currency.format(commissionBalance)}
          icon={WalletCards}
        />
        <StatCard
          label="Total de vendas"
          value={formatSales(totalSales)}
          icon={ShoppingBag}
        />
        <StatCard
          label="Conteúdos publicados"
          value={`${lessons.length} videoaulas`}
          icon={Video}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950">
          O que você deseja fazer?
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {actions.map(({ title, description, path, icon: Icon }) => (
            <Link key={path} to={`${basePath}/${path}`} className="group">
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon className="size-5" />
                    </span>
                    <ArrowRight className="size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
                  </div>
                  <CardTitle className="pt-2">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Videoaulas em destaque
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Seus conteúdos ordenados pelo número de vendas.
            </p>
          </div>
          <Link
            to={`${basePath}/videoaulas`}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Ver todas
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {topLessons.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-slate-500">
                Você ainda não cadastrou nenhuma videoaula.
              </CardContent>
            </Card>
          ) : (
            topLessons.map((lesson) => (
              <Card key={lesson.id_videoaula} data-testid="lesson-preview">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <LessonPreviewThumbnail lesson={lesson} />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {lesson.titulo}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatSales(lesson.totalVendas)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={lesson.gratuito ? 'secondary' : 'outline'}>
                    {lesson.gratuito
                      ? 'Gratuita'
                      : currency.format(lesson.valor || 0)}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </>
  )
}
