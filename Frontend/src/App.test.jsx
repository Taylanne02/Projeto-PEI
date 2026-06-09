import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

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
  ])('renderiza %s', (path, heading) => {
    renderRoute(path)

    expect(
      screen.getByRole('heading', { name: heading }),
    ).toBeInTheDocument()
  })

  it('exibe uma página para rota inexistente', () => {
    renderRoute('/rota-inexistente')

    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument()
  })
})
