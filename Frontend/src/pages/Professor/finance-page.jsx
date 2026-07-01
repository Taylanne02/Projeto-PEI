import {
  Banknote,
  Building2,
  CircleDollarSign,
  CreditCard,
  Percent,
  Smartphone,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { DataError, DataLoading } from '@/components/data-state'
import { PageHeading } from '@/components/page-heading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProfessorData } from '@/hooks/use-professor-data'
import { calculateLessonFinance } from '@/lib/finance'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const withdrawalDestinations = [
  { value: 'bank', label: 'Banco', icon: Building2, tone: 'bg-slate-900 text-white' },
  { value: 'pix', label: 'Pix', icon: Smartphone, tone: 'bg-emerald-600 text-white' },
  { value: 'visa', label: 'Visa', icon: CreditCard, tone: 'bg-blue-700 text-white' },
  { value: 'mastercard', label: 'Mastercard', icon: WalletCards, tone: 'bg-red-600 text-white' },
  { value: 'amex', label: 'Amex', icon: CreditCard, tone: 'bg-sky-600 text-white' },
  { value: 'paypal', label: 'PayPal', icon: WalletCards, tone: 'bg-blue-500 text-white' },
  { value: 'pagseguro', label: 'PagSeguro', icon: WalletCards, tone: 'bg-lime-600 text-white' },
  { value: 'credit-card', label: 'Credito', icon: CreditCard, tone: 'bg-indigo-600 text-white' },
  { value: 'debit-card', label: 'Debito', icon: CreditCard, tone: 'bg-zinc-700 text-white' },
]

function getWithdrawalDestinationLabel(value) {
  return (
    withdrawalDestinations.find((destination) => destination.value === value)
      ?.label || 'destino ficticio'
  )
}

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
  const { idProfessor } = useParams()
  const { commissionBalance, lessons, loading, error, refresh } =
    useProfessorData(idProfessor)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawDestination, setWithdrawDestination] = useState('')
  const [withdrawMessage, setWithdrawMessage] = useState('')
  const [withdrawError, setWithdrawError] = useState('')
  const [withdrawnAmount, setWithdrawnAmount] = useState(0)
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null)

  const availableBalance = Math.max(commissionBalance - withdrawnAmount, 0)
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

  function requestWithdrawal(event) {
    event.preventDefault()
    const amount = Number(withdrawAmount)
    const destinationLabel = getWithdrawalDestinationLabel(withdrawDestination)

    if (!amount || amount <= 0) {
      setWithdrawError('Informe um valor maior que zero.')
      return
    }

    if (!withdrawDestination) {
      setWithdrawError('Escolha onde o dinheiro sera colocado.')
      return
    }

    if (amount > availableBalance) {
      setWithdrawError('O valor solicitado nao pode ser maior que o saldo disponivel.')
      return
    }

    setWithdrawError('')
    setWithdrawOpen(false)
    setWithdrawMessage(
      `Solicitacao de retirada de ${currency.format(amount)} para ${destinationLabel} registrada como pendente.`,
    )
    setPendingWithdrawal({ amount, destinationLabel })
    setWithdrawAmount('')
    setWithdrawDestination('')
  }

  useEffect(() => {
    if (!pendingWithdrawal) return undefined

    const timeoutId = window.setTimeout(() => {
      setWithdrawnAmount((current) => current + pendingWithdrawal.amount)
      setWithdrawMessage(
        `${currency.format(pendingWithdrawal.amount)} saiu da conta do professor para ${pendingWithdrawal.destinationLabel}.`,
      )
      setPendingWithdrawal(null)
    }, 10000)

    return () => window.clearTimeout(timeoutId)
  }, [pendingWithdrawal])

  if (loading) return <DataLoading />
  if (error) return <DataError error={error} onRetry={refresh} />

  return (
    <>
      <PageHeading
        title="Financeiro"
        description="Acompanhe o faturamento gerado por cada videoaula e a comissão destinada ao professor."
      />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Resumo financeiro">
        <SummaryCard
          label="Saldo disponível"
          value={currency.format(availableBalance)}
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

      {withdrawMessage && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-900">
          <Banknote />
          <AlertTitle>
            {pendingWithdrawal ? 'Retirada solicitada' : 'Saldo atualizado'}
          </AlertTitle>
          <AlertDescription>{withdrawMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Retirada de dinheiro</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900">
              Saldo disponivel: {currency.format(availableBalance)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Este fluxo registra a solicitacao. A integracao bancaria real ainda precisa ser criada no backend.
            </p>
          </div>
          <Button
            onClick={() => {
              setWithdrawOpen(true)
              setWithdrawError('')
            }}
            disabled={availableBalance <= 0 || Boolean(pendingWithdrawal)}
          >
            Solicitar retirada
          </Button>
        </CardContent>
      </Card>

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

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar retirada</DialogTitle>
            <DialogDescription>
              Informe quanto deseja retirar do saldo de comissao disponivel.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={requestWithdrawal}>
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Valor da retirada</Label>
              <Input
                id="withdraw-amount"
                type="number"
                min="0"
                step="0.01"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
                placeholder="0,00"
              />
              <p className="text-sm text-slate-500">
                Maximo disponivel: {currency.format(availableBalance)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-destination">
                Onde colocar o dinheiro
              </Label>
              <div
                id="withdraw-destination"
                className="grid grid-cols-3 gap-2"
                role="radiogroup"
                aria-label="Onde colocar o dinheiro"
              >
                {withdrawalDestinations.map((destination) => {
                  const Icon = destination.icon
                  const selected = withdrawDestination === destination.value

                  return (
                    <button
                      key={destination.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`flex h-12 items-center gap-2 rounded-md border px-2 text-left text-xs font-bold transition ${
                        selected
                          ? 'border-indigo-600 ring-2 ring-indigo-300'
                          : 'border-slate-200 hover:border-indigo-300'
                      } ${destination.tone}`}
                      onClick={() => setWithdrawDestination(destination.value)}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{destination.label}</span>
                    </button>
                  )
                })}
              </div>
              <p className="text-sm text-slate-500">
                Esta escolha e apenas demonstrativa e nao realiza transferencia real.
              </p>
              {withdrawError && (
                <p className="text-sm text-destructive">{withdrawError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWithdrawOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Confirmar retirada</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
