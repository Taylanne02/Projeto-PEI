import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createApiClient } from './api'

describe('cliente da API do professor', () => {
  let fetchMock
  let api

  beforeEach(() => {
    fetchMock = vi.fn()
    api = createApiClient(fetchMock, 'http://localhost:3000')
  })

  it('busca o perfil individual do professor', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ professor: { id_professor: 1 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await api.getProfessorProfile(1)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/aluno/professor/1',
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
    )
  })

  it('envia os dados de uma nova videoaula', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id_videoaula: 4 }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const lesson = {
      titulo: 'Node.js',
      descricao: 'APIs com Express',
      gratuito: 'não',
      valor: 30,
    }

    await api.createVideoLesson(1, lesson)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/professor/1/videoaula',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(lesson),
      }),
    )
  })

  it('expõe a mensagem de erro retornada pelo backend', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ erro: 'Professor não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(api.getProfessorSales(99)).rejects.toMatchObject({
      message: 'Professor não encontrado',
      status: 404,
    })
  })
})
