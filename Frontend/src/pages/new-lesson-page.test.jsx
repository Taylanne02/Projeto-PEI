import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const createVideoLesson = vi.fn()
const refresh = vi.fn()

vi.mock('@/context/professor-context', () => ({
  useProfessor: () => ({
    idProfessor: '1',
    apiClient: { createVideoLesson },
    refresh,
  }),
}))

import { NewLessonPage } from './new-lesson-page'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/professor/1/videoaulas/nova']}>
      <Routes>
        <Route
          path="/professor/:idProfessor/videoaulas/nova"
          element={<NewLessonPage />}
        />
        <Route
          path="/professor/:idProfessor/videoaulas"
          element={<div>Lista atualizada</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('NewLessonPage', () => {
  beforeEach(() => {
    createVideoLesson.mockReset()
    refresh.mockReset()
    createVideoLesson.mockResolvedValue({ id_videoaula: 4 })
    refresh.mockResolvedValue()
  })

  it('exige título e valor positivo para uma videoaula paga', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Publicar videoaula' }))

    expect(screen.getByText('Informe o título da videoaula.')).toBeInTheDocument()
    expect(
      screen.getByText('Informe um valor maior que zero.'),
    ).toBeInTheDocument()
    expect(createVideoLesson).not.toHaveBeenCalled()
  })

  it('desativa o valor quando a videoaula é gratuita', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('switch', { name: 'Videoaula gratuita' }))

    expect(screen.getByLabelText('Valor por aluno')).toBeDisabled()
  })

  it('publica a videoaula e navega para a listagem', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Título'), 'Node.js com Express')
    await user.type(screen.getByLabelText('Descrição'), 'Criação de APIs')
    await user.type(screen.getByLabelText('Valor por aluno'), '35')
    await user.click(screen.getByRole('button', { name: 'Publicar videoaula' }))

    expect(createVideoLesson).toHaveBeenCalledWith('1', {
      titulo: 'Node.js com Express',
      descricao: 'Criação de APIs',
      gratuito: 'não',
      valor: 35,
    })
    expect(await screen.findByText('Lista atualizada')).toBeInTheDocument()
    expect(refresh).toHaveBeenCalled()
  })
})
