import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/context/professor-context', () => ({
  useProfessor: () => ({
    commissionBalance: 20.93,
    lessons: [
      {
        id_videoaula: 1,
        titulo: 'JavaScript Básico',
        valor: 29.9,
        gratuito: 0,
        totalVendas: 1,
      },
      {
        id_videoaula: 3,
        titulo: 'HTML Básico',
        valor: 0,
        gratuito: 1,
        totalVendas: 4,
      },
    ],
  }),
}))

import { calculateLessonFinance } from '@/lib/finance'
import { FinancePage } from './finance-page'

describe('calculateLessonFinance', () => {
  it('calcula faturamento bruto e comissão de 70%', () => {
    expect(
      calculateLessonFinance({ valor: 29.9, totalVendas: 1, gratuito: 0 }),
    ).toEqual({
      gross: 29.9,
      commission: 20.93,
    })
  })

  it('mantém receita zerada para aula gratuita', () => {
    expect(
      calculateLessonFinance({ valor: 0, totalVendas: 10, gratuito: 1 }),
    ).toEqual({
      gross: 0,
      commission: 0,
    })
  })
})

describe('FinancePage', () => {
  it('mostra saldo e detalhamento financeiro por videoaula', () => {
    render(<FinancePage />)

    const balance = screen.getByTestId('commission-balance')
    expect(within(balance).getByText('Saldo disponível')).toBeInTheDocument()
    expect(within(balance).getByText('R$ 20,93')).toBeInTheDocument()

    const paidLesson = screen.getByTestId('finance-lesson-1')
    expect(within(paidLesson).getAllByText('R$ 29,90')).toHaveLength(2)
    expect(within(paidLesson).getByText('R$ 20,93')).toBeInTheDocument()

    const freeLesson = screen.getByTestId('finance-lesson-3')
    expect(within(freeLesson).getAllByText('R$ 0,00')).toHaveLength(3)
  })
})
