import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-indigo-600">Erro 404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Página não encontrada
        </h1>
        <p className="mt-3 text-slate-600">
          O endereço acessado não existe neste painel.
        </p>
        <Button asChild className="mt-6">
          <Link to="/professor/1">
            <ArrowLeft />
            Voltar ao painel
          </Link>
        </Button>
      </div>
    </main>
  )
}
