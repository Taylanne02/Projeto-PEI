import './Home.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">

      {/* Navbar */}
      <header className="navbar">
        <div className="logo">NextWork</div>

        <nav>
          <a href="#sobre">Sobre</a>
          <a href="#categorias">Cursos</a>

          <Link to="/login" className="btn-login">
            Entrar
          </Link>

          <Link to="/cadastro" className="btn-cadastro">
            Cadastrar
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">

          <span className="tag">
            Plataforma educacional
          </span>

          <h1>
            Desenvolvendo competências para os desafios da vida adulta.
          </h1>

          <p>
            A NextWork conecta especialistas e estudantes por meio de
            videoaulas práticas sobre educação financeira, carreira,
            documentação, contratos e outros temas essenciais que normalmente
            não fazem parte da formação escolar.
          </p>

          <div className="hero-buttons">

            <Link to="/cadastro" className="btn-primary">
              Começar agora
            </Link>

            <Link to="/login" className="btn-secondary">
              Já tenho conta
            </Link>

          </div>
        </div>

        <div className="hero-card">

          <h3>Conhecimento para a vida real</h3>

          <ul>
            <li>✔ Videoaulas produzidas por especialistas</li>
            <li>✔ Cursos gratuitos e pagos</li>
            <li>✔ Aprenda no seu ritmo</li>
            <li>✔ Conteúdo prático e objetivo</li>
          </ul>

        </div>
      </section>

      {/* Estatísticas */}
      <section className="stats">

        <div className="stat">
          <h2>+200</h2>
          <p>Videoaulas</p>
        </div>

        <div className="stat">
          <h2>+50</h2>
          <p>Especialistas</p>
        </div>

        <div className="stat">
          <h2>+1.000</h2>
          <p>Alunos</p>
        </div>

        <div className="stat">
          <h2>4.9 ★</h2>
          <p>Avaliação média</p>
        </div>

      </section>

      {/* Como funciona */}
      <section id="sobre" className="sobre">

        <h2>Como funciona?</h2>

        <p>
          Cadastre-se, escolha seus cursos, aprenda com especialistas e
          desenvolva competências essenciais para sua vida pessoal e
          profissional.
        </p>

      </section>

      {/* Áreas */}
      <section id="categorias" className="pacotes">

        <h2>Áreas de conhecimento</h2>

        <div className="cards">

          <div className="pacote-card">

            <h3>Educação Financeira</h3>

            <p className="preco">Cursos</p>

            <ul>
              <li>Planejamento financeiro</li>
              <li>Controle de gastos</li>
              <li>Investimentos básicos</li>
            </ul>

            <Link to="/cadastro">
              Explorar
            </Link>

          </div>

          <div className="pacote-card destaque">

            <h3>Carreira Profissional</h3>

            <p className="preco">Cursos</p>

            <ul>
              <li>Currículo</li>
              <li>Entrevistas</li>
              <li>Mercado de trabalho</li>
            </ul>

            <Link to="/cadastro">
              Explorar
            </Link>

          </div>

          <div className="pacote-card">

            <h3>Documentação e Direitos</h3>

            <p className="preco">Cursos</p>

            <ul>
              <li>Contratos</li>
              <li>Tributos</li>
              <li>Documentação</li>
            </ul>

            <Link to="/cadastro">
              Explorar
            </Link>

          </div>

        </div>

      </section>

      {/* Professor */}
      <section className="sobre">

        <h2>Também é especialista?</h2>

        <p>
          Compartilhe seu conhecimento publicando videoaulas, acompanhe vendas,
          avaliações e alcance alunos interessados em desenvolver competências
          para os desafios da vida adulta.
        </p>

        <br />

        <Link to="/cadastro" className="btn-primary">
          Quero ser professor
        </Link>

      </section>

      {/* Rodapé */}
      <footer className="footer">

        <h3>NextWork</h3>

        <p>
          Conhecimento prático para preparar você para os desafios da vida
          adulta.
        </p>

        <small>
          © 2026 NextWork. Todos os direitos reservados.
        </small>

      </footer>

    </div>
  )
}

export default Home