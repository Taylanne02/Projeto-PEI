import { Banknote, CircleDollarSign, Percent, TrendingUp } from 'lucide-react'

import { PageHeading } from '@/components/page-heading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProfessor } from '@/context/professor-context'
import { calculateLessonFinance } from '@/lib/finance'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function SummaryCard({ label, value, icon: Icon, testId }) {
  return (
    <Card data-testid={testId}>
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

export function FinancePage() {
  const { commissionBalance, lessons } = useProfessor()
  const financialLessons = lessons.map((lesson) => ({
    ...lesson,
    ...calculateLessonFinance(lesson),
  }))
  const grossTotal = financialLessons.reduce(
    (total, lesson) => total + lesson.gross,
    0,
  )
  const estimatedCommissionTotal = financialLessons.reduce(
    (total, lesson) => total + lesson.commission,
    0,
  )

  return (
    <>
      <PageHeading
        title="Financeiro"
        description="Acompanhe o faturamento gerado por cada videoaula e a comissão destinada ao professor."
      />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Resumo financeiro">
        <SummaryCard
          label="Saldo disponível"
          value={currency.format(commissionBalance)}
          icon={Banknote}
          testId="commission-balance"
        />
        <SummaryCard
          label="Faturamento bruto"
          value={currency.format(grossTotal)}
          icon={TrendingUp}
        />
        <SummaryCard
          label="Comissão estimada"
          value={currency.format(estimatedCommissionTotal)}
          icon={CircleDollarSign}
        />
      </section>

      <Alert className="my-6 border-indigo-200 bg-indigo-50 text-indigo-950">
        <Percent />
        <AlertTitle>Comissão de 70%</AlertTitle>
        <AlertDescription>
          O professor recebe 70% do valor de cada venda paga. Aulas gratuitas
          não geram receita.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Receita por videoaula</CardTitle>
        </CardHeader>
        <CardContent>
          {financialLessons.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              Nenhuma videoaula cadastrada para calcular receitas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Videoaula</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Bruto</TableHead>
                    <TableHead>Comissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialLessons.map((lesson) => (
                    <TableRow
                      key={lesson.id_videoaula}
                      data-testid={`finance-lesson-${lesson.id_videoaula}`}
                    >
                      <TableCell>
                        <div className="font-medium text-slate-900">
                          {lesson.titulo}
                        </div>
                        {lesson.gratuito === 1 && (
                          <Badge variant="secondary" className="mt-1">
                            Gratuita
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{currency.format(lesson.valor || 0)}</TableCell>
                      <TableCell>{lesson.totalVendas}</TableCell>
                      <TableCell>{currency.format(lesson.gross)}</TableCell>
                      <TableCell className="font-semibold text-indigo-700">
                        {currency.format(lesson.commission)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
