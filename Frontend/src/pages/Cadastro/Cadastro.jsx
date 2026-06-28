import './Cadastro.css'

export default function Cadastro() {
  return (
    <main className="auth-page">
      <section className="auth-card cadastro-card">
        <a href="/" className="auth-logo">NextWork</a>

        <h1>Criar conta</h1>

        <p>
          Cadastre-se como aluno ou professor e comece a utilizar a plataforma.
        </p>

        <form className="auth-form">
          <label>
            Nome completo
            <input type="text" placeholder="Digite seu nome" />
          </label>

          <label>
            E-mail
            <input type="email" placeholder="Digite seu e-mail" />
          </label>

          <label>
            CPF
            <input type="text" placeholder="Digite seu CPF" />
          </label>

          <label>
            Tipo de usuário
            <select>
              <option value="">Selecione</option>
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
            </select>
          </label>

          <label>
            Senha
            <input type="password" placeholder="Crie uma senha" />
          </label>

          <button type="submit">Cadastrar</button>
        </form>

        <span>
          Já possui conta? <a href="/login">Entrar</a>
        </span>
      </section>
    </main>
  )
}