export function PerfilAlunoPage() {
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Meu perfil</h1>

      <p className="mt-2 text-slate-600">
        Consulte suas informações cadastradas na plataforma.
      </p>

      <div className="mt-8 max-w-xl rounded-xl border bg-white p-6">
        <p>
          <strong>Nome:</strong> {usuario?.nome}
        </p>

        <p className="mt-3">
          <strong>E-mail:</strong> {usuario?.email}
        </p>

        <p className="mt-3">
          <strong>CPF:</strong> {usuario?.cpf}
        </p>

        <p className="mt-3">
          <strong>Tipo de usuário:</strong> Aluno
        </p>
      </div>
    </div>
  )
}