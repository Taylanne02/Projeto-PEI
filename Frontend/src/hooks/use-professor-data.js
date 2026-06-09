import { useCallback, useEffect, useState } from 'react'

import { api } from '@/services/api'

export function useProfessorData(idProfessor, { profile = false } = {}) {
  const [state, setState] = useState({
    professor: null,
    lessons: [],
    totalSales: 0,
    commissionBalance: 0,
    loading: true,
    error: null,
  })

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const requests = [api.getProfessorSales(idProfessor)]

      if (profile) {
        requests.push(api.getProfessorProfile(idProfessor))
      }

      const [salesResponse, profileResponse] = await Promise.all(requests)

      setState({
        professor: profileResponse?.professor || null,
        lessons: salesResponse.videoaulas || [],
        totalSales: salesResponse.totalVendas || 0,
        commissionBalance: salesResponse.saldoComissao || 0,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error }))
    }
  }, [idProfessor, profile])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    ...state,
    refresh,
  }
}
