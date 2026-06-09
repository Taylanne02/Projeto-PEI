import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('exibe professor não encontrado para resposta 404', async () => {
    const apiClient = {
      getProfessorProfile: vi.fn().mockRejectedValue(
        Object.assign(new Error('Professor não encontrado'), { status: 404 }),
      ),
      getProfessorSales: vi.fn().mockResolvedValue({}),
    }

    render(
      <ProfessorProvider idProfessor="99" apiClient={apiClient}>
        <Consumer />
      </ProfessorProvider>,
    )

    const alert = await screen.findByRole('alert')
    expect(
      within(alert).getAllByText('Professor não encontrado'),
    ).toHaveLength(2)
  })

  it('permite tentar novamente após falha da API', async () => {
    const user = userEvent.setup()
    const apiClient = {
      getProfessorProfile: vi
        .fn()
        .mockRejectedValueOnce(new Error('Backend indisponível'))
        .mockResolvedValue({
          professor: { id_professor: 1, nome: 'Carlos Professor' },
        }),
      getProfessorSales: vi.fn().mockResolvedValue({
        totalVendas: 1,
        saldoComissao: 20.93,
        videoaulas: [],
      }),
    }

    render(
      <ProfessorProvider idProfessor="1" apiClient={apiClient}>
        <Consumer />
      </ProfessorProvider>,
    )

    await user.click(await screen.findByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByText('Carlos Professor')).toBeInTheDocument()
    expect(apiClient.getProfessorProfile).toHaveBeenCalledTimes(2)
  })
})
