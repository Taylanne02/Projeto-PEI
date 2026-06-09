import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function DataLoading() {
  return (
    <div className="space-y-6">
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

export function DataError({ error, onRetry }) {
  const notFound = error?.status === 404

  return (
    <Alert variant="destructive" className="mx-auto max-w-xl">
      <AlertTitle>
        {notFound
          ? 'Professor não encontrado'
          : 'Não foi possível carregar os dados'}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {error?.message ||
          'Verifique se o backend está em execução e tente novamente.'}
      </AlertDescription>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Tentar novamente
      </Button>
    </Alert>
  )
}
