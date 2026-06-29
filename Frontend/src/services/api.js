const DEFAULT_API_URL = 'http://localhost:3000'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function createApiClient(
  fetchImplementation = fetch,
  baseUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL,
) {
  async function request(path, options = {}) {
    const response = await fetchImplementation(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new ApiError(
        data.erro || 'Não foi possível concluir a solicitação.',
        response.status,
      )
    }

    return data
  }

  return {
    getProfessorProfile(idProfessor) {
      return request(`/aluno/professor/${idProfessor}`)
    },
    getProfessorSales(idProfessor) {
      return request(`/professor/${idProfessor}/vendas`)
    },
    createVideoLesson(idProfessor, data) {
      return request(`/professor/${idProfessor}/videoaula`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    updateVideoLesson(idVideoLesson, data) {
      return request(`/professor/videoaula/${idVideoLesson}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    deleteVideoLesson(idVideoLesson) {
      return request(`/professor/videoaula/${idVideoLesson}`, {
        method: 'DELETE',
      })
    },
    getVideoLessonReviews(idVideoLesson) {
      return request(`/avaliacao/videoaula/${idVideoLesson}`)
    },
    getAllVideoLessons() {
      return request('/aluno/videoaulas')
    },
    getStudentPurchases(idAluno) {
      return request(`/aluno/${idAluno}/compras`)
    },
    getStudentReviews(idAluno) {
      return request(`/aluno/${idAluno}/avaliacoes`)
    },
  }
}

export const api = createApiClient()
