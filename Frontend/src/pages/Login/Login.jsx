import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    senha: '',
  })

  const [mensagem, setMensagem] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch('http://localhost:3000/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setMensagem(data.erro || 'Erro ao realizar login.')
        return
      }

      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      if (data.usuario.tipoUsuario === 'professor') {
        navigate(`/professor/${data.usuario.id_professor}`)
      } else {
        navigate(`/aluno/${data.usuario.id_aluno}`)
      }

    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">NextWork</Link>

        <h1>Entrar na plataforma</h1>

        <p>
          Acesse sua conta para continuar seus estudos ou gerenciar suas
          videoaulas.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Entrar</button>
        </form>

        {mensagem && <p className="auth-message">{mensagem}</p>}

        <span>
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </span>
      </section>
    </main>
  )
}