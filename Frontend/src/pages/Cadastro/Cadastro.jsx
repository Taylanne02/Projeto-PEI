import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()

  const [arquivo, setArquivo] = useState(null);

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
  event.preventDefault();

  if (form.tipoUsuario === "professor" && !arquivo) {
      setMensagem("Professor precisa enviar o documento obrigatório.");
      return;
    }

  try {
    const formData = new FormData();

    formData.append("nome", form.nome);
    formData.append("email", form.email);
    formData.append("senha", form.senha);
    formData.append("cpf", form.cpf);
    formData.append("tipoUsuario", form.tipoUsuario);


    const response = await fetch(
      "http://localhost:3000/usuario",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (arquivo && data.id_professor) {
  const formData = new FormData();

  formData.append("documento", arquivo);

  await fetch(
    `http://localhost:3000/professor/${data.id_professor}/comprovante`,
    {
      method: "POST",
      body: formData,
    }
  );
}

    if (!response.ok) {
      setMensagem(data.erro || "Erro ao cadastrar usuário.");
      return;
    }

    setMensagem("Cadastro realizado com sucesso!");

    setTimeout(() => {
      navigate("/login");
    }, 1000);

  } catch (error) {
    setMensagem("Erro ao conectar com o servidor.");
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

          {form.tipoUsuario === "professor" && (
            <label>
              Documento Obrigatorio

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setArquivo(e.target.files[0])}
              />
            </label>
          )}

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