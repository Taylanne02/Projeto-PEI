import './Login.css'

export default function Login() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <a href="/" className="auth-logo">NextWork</a>

        <h1>Entrar na plataforma</h1>

        <p>
          Acesse sua conta para continuar seus estudos ou gerenciar suas videoaulas.
        </p>

        <form className="auth-form">
          <label>
            E-mail
            <input type="email" placeholder="Digite seu e-mail" />
          </label>

          <label>
            Senha
            <input type="password" placeholder="Digite sua senha" />
          </label>

          <button type="submit">Entrar</button>
        </form>

        <span>
          Ainda não tem conta? <a href="/cadastro">Cadastre-se</a>
        </span>
      </section>
    </main>
  )
}