import { Link } from 'react-router-dom'

export function StartPage() {
  return (
    <main className="grid min-h-screen place-items-center">
      <Link
        to="/professor/1"
        className="rounded bg-indigo-600 px-4 py-2 text-white"
      >
        Acessar painel do professor
      </Link>
    </main>
  )
}
