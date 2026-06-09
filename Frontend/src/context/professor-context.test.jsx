import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  ProfessorProvider,
  useProfessor,
} from './professor-context'

function Consumer() {
  const { professor, lessons, totalSales } = useProfessor()

  return (
    <div>
      <span>{professor.nome}</span>
      <span>{lessons.length} aulas</span>
      <span>{totalSales} vendas</span>
    </div>
  )
}

describe('ProfessorProvider', () => {
  it('combina perfil e vendas do professor', async () => {
    const apiClient = {
      getProfessorProfile: vi.fn().mockResolvedValue({
        professor: { id_professor: 1, nome: 'Carlos Professor' },
      }),
      getProfessorSales: vi.fn().mockResolvedValue({
        totalVendas: 1,
        saldoComissao: 20.93,
        videoaulas: [{ id_videoaula: 1, titulo: 'JavaScript Básico' }],
      }),
    }

    render(
      <ProfessorProvider idProfessor="1" apiClient={apiClient}>
        <Consumer />
      </ProfessorProvider>,
    )

    expect(await screen.findByText('Carlos Professor')).toBeInTheDocument()
    expect(screen.getByText('1 aulas')).toBeInTheDocument()
    expect(screen.getByText('1 vendas')).toBeInTheDocument()
  })
})
