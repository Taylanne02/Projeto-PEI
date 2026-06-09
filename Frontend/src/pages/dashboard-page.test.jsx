import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/context/professor-context', () => ({
  useProfessor: () => ({
    idProfessor: '1',
    professor: { nome: 'Carlos Professor' },
    commissionBalance: 20.93,
    totalSales: 3,
    lessons: [
      { id_videoaula: 1, titulo: 'JavaScript Básico', totalVendas: 3 },
      { id_videoaula: 2, titulo: 'React Completo', totalVendas: 8 },
    ],
  }),
}))

import { DashboardPage } from './dashboard-page'

describe('DashboardPage', () => {
  it('mostra indicadores e os quatro atalhos', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    const indicators = within(screen.getByRole('region', { name: 'Indicadores' }))
    expect(indicators.getByText('R$ 20,93')).toBeInTheDocument()
    expect(indicators.getByText('3 vendas')).toBeInTheDocument()
    expect(indicators.getByText('2 videoaulas')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Adicionar videoaula/i }),
    ).toHaveAttribute('href', '/professor/1/videoaulas/nova')
    expect(
      screen.getByRole('link', { name: /Gerenciar videoaulas/i }),
    ).toHaveAttribute('href', '/professor/1/videoaulas')
    expect(
      screen.getByRole('link', { name: /Avaliações e desempenho/i }),
    ).toHaveAttribute('href', '/professor/1/avaliacoes')
    expect(screen.getByRole('link', { name: /Financeiro/i })).toHaveAttribute(
      'href',
      '/professor/1/financeiro',
    )
  })

  it('ordena a prévia pelas aulas com mais vendas', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    const lessons = screen.getAllByTestId('lesson-preview')
    expect(lessons[0]).toHaveTextContent('React Completo')
    expect(lessons[1]).toHaveTextContent('JavaScript Básico')
  })
})
