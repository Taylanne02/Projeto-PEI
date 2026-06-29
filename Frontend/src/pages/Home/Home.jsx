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
          <a href="#categorias">Planos</a>

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
          <span className="tag">Plataforma educacional</span>

          <h1>
            Desenvolvendo competências para os desafios da vida adulta.
          </h1>

          <p>
            A NextWork conecta especialistas e estudantes por meio de videoaulas
            práticas sobre educação financeira, carreira, documentação,
            contratos e outros temas essenciais que normalmente não fazem parte
            da formação escolar.
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

      {/* Como funciona */}
      <section id="sobre" className="sobre">
        <h2>Como funciona?</h2>

        <p>
          Cadastre-se, escolha seus cursos, aprenda com especialistas e
          desenvolva competências essenciais para sua vida pessoal e
          profissional.
        </p>
      </section>

      {/* Planos */}
<section id="categorias" className="pacotes">
  <h2>Opções da plataforma</h2>

  <div className="cards">
    <div className="pacote-card">
      <h3>Plano Gratuito</h3>

      <p className="preco">Acesso inicial</p>

      <ul>
        <li>Aluno pode acessar videoaulas gratuitas</li>
        <li>Aluno pode conhecer professores e conteúdos</li>
        <li>Professor pode publicar aulas inicialmente gratuitas</li>
        <li>Professor pode validar seu conteúdo na plataforma</li>
      </ul>

      <Link to="/cadastro">Começar grátis</Link>
    </div>

    <div className="pacote-card destaque">
      <h3>Plano Pago</h3>

      <p className="preco">Acesso PRO</p>

      <ul>
        <li>Aluno pode adquirir videoaulas pagas</li>
        <li>Aluno tem acesso a conteúdos mais completos</li>
        <li>Professor tem mais recursos</li>
        <li>Possibilidade maior de aulas remuneradas</li>
      </ul>

      <Link to="/cadastro">R$ 59,90 mensal</Link>
    </div>
  </div>
</section>

      {/* Professor */}
      <section className="sobre">
        <h2>Compartilhe seu conhecimento</h2>

        <p>
          Professores especialistas podem publicar videoaulas, definir valores,
          acompanhar vendas, visualizar avaliações e contribuir para a formação
          de jovens preparados para os desafios da vida adulta.
        </p>

        <div style={{ marginTop: '30px' }}>
          <Link to="/cadastro" className="btn-primary">
            Quero ser professor
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home