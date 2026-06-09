import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getVideoLessonReviews = vi.fn()

vi.mock('@/context/professor-context', () => ({
  useProfessor: () => ({
    lessons: [
      {
        id_videoaula: 1,
        titulo: 'JavaScript Básico',
        gratuito: 0,
        totalVendas: 1,
      },
      {
        id_videoaula: 2,
        titulo: 'React Completo',
        gratuito: 0,
        totalVendas: 0,
      },
    ],
    apiClient: { getVideoLessonReviews },
  }),
}))

import { ReviewsPage } from './reviews-page'

describe('ReviewsPage', () => {
  beforeEach(() => {
    getVideoLessonReviews.mockReset()
  })

  it('carrega avaliações somente quando a aula é aberta', async () => {
    getVideoLessonReviews.mockResolvedValue({
      totalAvaliacoes: 1,
      mediaNotas: 5,
      avaliacoes: [
        {
          id_avaliacao: 2,
          nomeAluno: 'Ana Aluna',
          nota: 5,
          comentario: 'Muito bem explicada!',
        },
      ],
    })
    const user = userEvent.setup()
    render(<ReviewsPage />)

    expect(getVideoLessonReviews).not.toHaveBeenCalled()

    await user.click(
      screen.getByRole('button', { name: /JavaScript Básico/i }),
    )

    expect(getVideoLessonReviews).toHaveBeenCalledWith(1)
    expect(await screen.findByText('Muito bem explicada!')).toBeInTheDocument()
    expect(screen.getByText('Ana Aluna')).toBeInTheDocument()
    expect(screen.getByText('Média 5,0')).toBeInTheDocument()
  })

  it('informa quando a aula ainda não possui avaliações', async () => {
    getVideoLessonReviews.mockResolvedValue({
      totalAvaliacoes: 0,
      mediaNotas: 0,
      avaliacoes: [],
    })
    const user = userEvent.setup()
    render(<ReviewsPage />)

    await user.click(screen.getByRole('button', { name: /React Completo/i }))

    expect(
      await screen.findByText('Esta videoaula ainda não recebeu avaliações.'),
    ).toBeInTheDocument()
  })
})
