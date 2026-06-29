import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    tipoUsuario: '',
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
      const response = await fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setMensagem(data.erro || 'Erro ao cadastrar usuário.')
        return
      }

      setMensagem('Cadastro realizado com sucesso!')

      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card cadastro-card">
        <Link to="/" className="auth-logo">NextWork</Link>

        <h1>Criar conta</h1>

        <p>
          Cadastre-se como aluno ou professor e comece a utilizar a plataforma.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nome completo
            <input
              type="text"
              name="nome"
              placeholder="Digite seu nome"
              value={form.nome}
              onChange={handleChange}
            />
          </label>

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
            CPF
            <input
              type="text"
              name="cpf"
              placeholder="Digite seu CPF"
              value={form.cpf}
              onChange={handleChange}
            />
          </label>

          <label>
            Tipo de usuário
            <select
              name="tipoUsuario"
              value={form.tipoUsuario}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
            </select>
          </label>

          <label>
            Senha
            <input
              type="password"
              name="senha"
              placeholder="Crie uma senha"
              value={form.senha}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Cadastrar</button>
        </form>

        {mensagem && <p className="auth-message">{mensagem}</p>}

        <span>
          Já possui conta? <Link to="/login">Entrar</Link>
        </span>
      </section>
    </main>
  )
}