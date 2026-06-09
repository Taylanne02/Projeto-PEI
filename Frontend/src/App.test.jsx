import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  api: {
    getProfessorProfile: vi.fn().mockResolvedValue({
      professor: { id_professor: 1, nome: 'Carlos Professor' },
    }),
    getProfessorSales: vi.fn().mockResolvedValue({
      totalVendas: 1,
      saldoComissao: 20.93,
      videoaulas: [],
    }),
  },
}))

import { AppRoutes } from './App'

function renderRoute(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('rotas do painel do professor', () => {
  it.each([
    ['/professor/1', 'Visão geral'],
    ['/professor/1/videoaulas/nova', 'Adicionar videoaula'],
    ['/professor/1/videoaulas', 'Gerenciar videoaulas'],
    ['/professor/1/avaliacoes', 'Avaliações e desempenho'],
    ['/professor/1/financeiro', 'Financeiro'],
  ])('renderiza %s', async (path, heading) => {
    renderRoute(path)

    expect(
      await screen.findByRole('heading', { name: heading }),
    ).toBeInTheDocument()
  })

  it('exibe uma página para rota inexistente', () => {
    renderRoute('/rota-inexistente')

    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument()
  })
})
