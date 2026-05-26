const express = require("express");
const router = express.Router();
const db = require("../database");

// POST - registrarAvaliacao() / avaliarAula()
router.post("/", (req, res) => {
  try {
    const { id_aluno, id_videoaula, nota, comentario } = req.body;

    // validações
    if (!id_aluno || !id_videoaula || !nota) {
      return res.status(400).json({
        erro: "id_aluno, id_videoaula e nota são obrigatórios"
      });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({
        erro: "A nota deve estar entre 1 e 5"
      });
    }

    // verifica aluno
    const aluno = db.prepare(`
      SELECT * FROM aluno
      WHERE id_aluno = ?
    `).get(id_aluno);

    if (!aluno) {
      return res.status(404).json({
        erro: "Aluno não encontrado"
      });
    }

    // verifica videoaula
    const videoaula = db.prepare(`
      SELECT * FROM videoaula
      WHERE id_videoaula = ?
    `).get(id_videoaula);

    if (!videoaula) {
      return res.status(404).json({
        erro: "Videoaula não encontrada"
      });
    }

    // verifica se o aluno comprou a aula
    const compra = db.prepare(`
      SELECT * FROM pagamento
      WHERE id_aluno = ?
      AND id_videoaula = ?
      AND status = 'concluido'
    `).get(id_aluno, id_videoaula);

    if (!compra) {
      return res.status(400).json({
        erro: "O aluno precisa comprar a videoaula antes de avaliar"
      });
    }

    // verifica se já avaliou
    const avaliacaoExiste = db.prepare(`
      SELECT * FROM avaliacao
      WHERE id_aluno = ?
      AND id_videoaula = ?
    `).get(id_aluno, id_videoaula);

    if (avaliacaoExiste) {
      return res.status(400).json({
        erro: "Aluno já avaliou esta videoaula"
      });
    }

    // registrar avaliação
    const resultado = db.prepare(`
      INSERT INTO avaliacao (
        id_aluno,
        id_videoaula,
        nota,
        comentario
      )
      VALUES (?, ?, ?, ?)
    `).run(
      id_aluno,
      id_videoaula,
      nota,
      comentario || ""
    );

    res.status(201).json({
      mensagem: "Avaliação registrada com sucesso!",
      id_avaliacao: resultado.lastInsertRowid,
      id_aluno,
      id_videoaula,
      nota,
      comentario: comentario || ""
    });

  } catch (erro) {
    console.log(erro);

    res.status(500).json({
      erro: "Erro ao registrar avaliação"
    });
  }
});

// PUT - editarAvaliacao()
router.put("/:id_avaliacao", (req, res) => {
  try {
    const { id_avaliacao } = req.params;
    const { nota, comentario } = req.body;

    if (!nota) {
      return res.status(400).json({
        erro: "A nota é obrigatória"
      });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({
        erro: "A nota deve estar entre 1 e 5"
      });
    }

    const avaliacaoExiste = db.prepare(`
      SELECT * FROM avaliacao
      WHERE id_avaliacao = ?
    `).get(id_avaliacao);

    if (!avaliacaoExiste) {
      return res.status(404).json({
        erro: "Avaliação não encontrada"
      });
    }

    const resultado = db.prepare(`
      UPDATE avaliacao
      SET nota = ?, comentario = ?
      WHERE id_avaliacao = ?
    `).run(
      nota,
      comentario || "",
      id_avaliacao
    );

    res.status(200).json({
      mensagem: "Avaliação editada com sucesso!",
      linhasAlteradas: resultado.changes
    });

  } catch (erro) {
    console.log(erro);

    res.status(500).json({
      erro: "Erro ao editar avaliação"
    });
  }
});

// DELETE - removerAvaliacao()
router.delete("/:id_avaliacao", (req, res) => {
  try {
    const { id_avaliacao } = req.params;

    const resultado = db.prepare(`
      DELETE FROM avaliacao
      WHERE id_avaliacao = ?
    `).run(id_avaliacao);

    if (resultado.changes === 0) {
      return res.status(404).json({
        erro: "Avaliação não encontrada"
      });
    }

    res.status(200).json({
      mensagem: "Avaliação removida com sucesso!"
    });

  } catch (erro) {
    console.log(erro);

    res.status(500).json({
      erro: "Erro ao remover avaliação"
    });
  }
});

// GET - avaliarAula() / visualizar avaliações da aula
router.get("/videoaula/:id_videoaula", (req, res) => {
  try {
    const { id_videoaula } = req.params;

    const avaliacoes = db.prepare(`
      SELECT
        avaliacao.id_avaliacao,
        avaliacao.nota,
        avaliacao.comentario,

        aluno.id_aluno,
        usuario.nome AS nomeAluno

      FROM avaliacao

      INNER JOIN aluno
        ON avaliacao.id_aluno = aluno.id_aluno

      INNER JOIN usuario
        ON aluno.id_usuario = usuario.id_usuario

      WHERE avaliacao.id_videoaula = ?
    `).all(id_videoaula);

    const media = db.prepare(`
      SELECT AVG(nota) AS mediaNotas
      FROM avaliacao
      WHERE id_videoaula = ?
    `).get(id_videoaula);

    res.status(200).json({
      totalAvaliacoes: avaliacoes.length,
      mediaNotas: media.mediaNotas || 0,
      avaliacoes
    });

  } catch (erro) {
    console.log(erro);

    res.status(500).json({
      erro: "Erro ao visualizar avaliações"
    });
  }
});

module.exports = router;