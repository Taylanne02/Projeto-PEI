import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const updateVideoLesson = vi.fn()
const deleteVideoLesson = vi.fn()
const refresh = vi.fn()

vi.mock('@/context/professor-context', () => ({
  useProfessor: () => ({
    idProfessor: '1',
    lessons: [
      {
        id_videoaula: 1,
        titulo: 'JavaScript Básico',
        descricao: 'Introdução',
        valor: 29.9,
        gratuito: 0,
        totalVendas: 1,
      },
      {
        id_videoaula: 3,
        titulo: 'HTML Básico',
        descricao: 'HTML semântico',
        valor: 0,
        gratuito: 1,
        totalVendas: 0,
      },
    ],
    apiClient: { updateVideoLesson, deleteVideoLesson },
    refresh,
  }),
}))

import { LessonsPage } from './lessons-page'

describe('LessonsPage', () => {
  beforeEach(() => {
    updateVideoLesson.mockReset().mockResolvedValue({})
    deleteVideoLesson.mockReset().mockResolvedValue({})
    refresh.mockReset().mockResolvedValue()
  })

  it('ordena as videoaulas mais recentes primeiro', () => {
    render(
      <MemoryRouter>
        <LessonsPage />
      </MemoryRouter>,
    )

    const lessons = screen.getAllByTestId('managed-lesson')
    expect(lessons[0]).toHaveTextContent('HTML Básico')
    expect(lessons[1]).toHaveTextContent('JavaScript Básico')
  })

  it('edita uma videoaula', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LessonsPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Editar JavaScript Básico' }))
    const title = screen.getByLabelText('Título')
    await user.clear(title)
    await user.type(title, 'JavaScript Essencial')
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(updateVideoLesson).toHaveBeenCalledWith(1, {
      titulo: 'JavaScript Essencial',
      descricao: 'Introdução',
      gratuito: 'não',
      valor: 29.9,
    })
    expect(refresh).toHaveBeenCalled()
  })

  it('exclui uma videoaula após confirmação', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LessonsPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Excluir HTML Básico' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão' }))

    expect(deleteVideoLesson).toHaveBeenCalledWith(3)
    expect(refresh).toHaveBeenCalled()
  })
})
