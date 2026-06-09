import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/services/api'

const ProfessorContext = createContext(null)

function LoadingState() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  const notFound = error?.status === 404

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Alert variant="destructive" className="max-w-xl">
        <AlertTitle>
          {notFound ? 'Professor não encontrado' : 'Não foi possível carregar o painel'}
        </AlertTitle>
        <AlertDescription className="mt-2">
          {error?.message || 'Verifique se o backend está em execução e tente novamente.'}
        </AlertDescription>
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Tentar novamente
        </Button>
      </Alert>
    </main>
  )
}

export function ProfessorProvider({
  idProfessor,
  apiClient = api,
  children,
}) {
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
      const [profileResponse, salesResponse] = await Promise.all([
        apiClient.getProfessorProfile(idProfessor),
        apiClient.getProfessorSales(idProfessor),
      ])

      setState({
        professor: profileResponse.professor,
        lessons: salesResponse.videoaulas || [],
        totalSales: salesResponse.totalVendas || 0,
        commissionBalance: salesResponse.saldoComissao || 0,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error }))
    }
  }, [apiClient, idProfessor])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      ...state,
      idProfessor,
      refresh,
      apiClient,
    }),
    [apiClient, idProfessor, refresh, state],
  )

  if (state.loading) {
    return <LoadingState />
  }

  if (state.error) {
    return <ErrorState error={state.error} onRetry={refresh} />
  }

  return (
    <ProfessorContext.Provider value={value}>
      {children}
    </ProfessorContext.Provider>
  )
}

export function useProfessor() {
  const context = useContext(ProfessorContext)

  if (!context) {
    throw new Error('useProfessor deve ser usado dentro de ProfessorProvider')
  }

  return context
}
