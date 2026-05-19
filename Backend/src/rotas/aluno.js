const express = require("express");
const router = express.Router();
const db = require("../database");

// GET - visualizarVideoAulas()
router.get("/videoaulas", (req, res) => {
  try {
    const videoaulas = db.prepare(`
      SELECT 
        videoaula.id_videoaula,
        videoaula.titulo,
        videoaula.descricao,
        videoaula.valor,
        videoaula.gratuito,
        videoaula.totalVendas,
        professor.id_professor,
        usuario.nome AS nomeProfessor
      FROM videoaula
      INNER JOIN professor ON videoaula.id_professor = professor.id_professor
      INNER JOIN usuario ON professor.id_usuario = usuario.id_usuario
      ORDER BY videoaula.id_videoaula DESC
    `).all();

    res.status(200).json({
      total: videoaulas.length,
      videoaulas
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao visualizar videoaulas" });
  }
});

// GET - visualizarPerfilProfessor()
router.get("/professor/:id_professor", (req, res) => {
  try {
    const { id_professor } = req.params;

    const professor = db.prepare(`
      SELECT 
        professor.id_professor,
        professor.id_usuario,
        usuario.nome,
        usuario.email,
        professor.foto,
        professor.biografia,
        professor.saldoComissao,
        professor.listaVideoAulas
      FROM professor
      INNER JOIN usuario ON professor.id_usuario = usuario.id_usuario
      WHERE professor.id_professor = ?
    `).get(id_professor);

    if (!professor) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }

    const videoaulas = db.prepare(`
      SELECT * FROM videoaula
      WHERE id_professor = ?
    `).all(id_professor);

    res.status(200).json({
      professor,
      videoaulas
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao visualizar perfil do professor" });
  }
});

// POST - comprarVideoAula()
// Agora recebe id_videoaula e formaPagamento pelo body.
// O pagamento já fica concluído.
router.post("/:id_aluno/comprar", (req, res) => {
  try {
    const { id_aluno } = req.params;
    const { id_videoaula, formaPagamento } = req.body;

    if (!id_videoaula || !formaPagamento) {
      return res.status(400).json({
        erro: "id_videoaula e formaPagamento são obrigatórios"
      });
    }

    const aluno = db.prepare(`
      SELECT * FROM aluno WHERE id_aluno = ?
    `).get(id_aluno);

    if (!aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    const videoaula = db.prepare(`
      SELECT * FROM videoaula WHERE id_videoaula = ?
    `).get(id_videoaula);

    if (!videoaula) {
      return res.status(404).json({ erro: "Videoaula não encontrada" });
    }

    const pagamentoExistente = db.prepare(`
      SELECT * FROM pagamento
      WHERE id_aluno = ? 
      AND id_videoaula = ? 
      AND status = 'concluido'
    `).get(id_aluno, id_videoaula);

    if (pagamentoExistente) {
      return res.status(400).json({ erro: "Aluno já comprou essa videoaula" });
    }

    const valorFinal = videoaula.gratuito === 1 ? 0 : videoaula.valor;

    const pagamento = db.prepare(`
      INSERT INTO pagamento (id_aluno, id_videoaula, valor, status, dataPagamento)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      id_aluno,
      id_videoaula,
      valorFinal,
      "concluido",
      new Date().toLocaleString("pt-BR")
    );

    db.prepare(`
      UPDATE aluno
      SET formaPagamento = ?
      WHERE id_aluno = ?
    `).run(formaPagamento, id_aluno);

    db.prepare(`
      UPDATE videoaula
      SET totalVendas = totalVendas + 1
      WHERE id_videoaula = ?
    `).run(id_videoaula);

    if (videoaula.gratuito === 0) {
      const comissaoProfessor = valorFinal * 0.7;

      db.prepare(`
        UPDATE professor
        SET saldoComissao = saldoComissao + ?
        WHERE id_professor = ?
      `).run(comissaoProfessor, videoaula.id_professor);
    }

    const historicoAtual = aluno.historicoCompras || "";
    const novoHistorico = historicoAtual
      ? `${historicoAtual},${id_videoaula}`
      : `${id_videoaula}`;

    db.prepare(`
      UPDATE aluno
      SET historicoCompras = ?
      WHERE id_aluno = ?
    `).run(novoHistorico, id_aluno);

    res.status(201).json({
      mensagem: "Videoaula comprada com sucesso!",
      id_pagamento: pagamento.lastInsertRowid,
      id_aluno,
      id_videoaula,
      valor: valorFinal,
      status: "concluido",
      formaPagamento,
      gratuito: videoaula.gratuito === 1 ? "sim" : "não"
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao comprar videoaula" });
  }
});

// POST - avaliarAula()
router.post("/:id_aluno/avaliar/:id_videoaula", (req, res) => {
  try {
    const { id_aluno, id_videoaula } = req.params;
    const { nota, comentario } = req.body;

    if (!nota) {
      return res.status(400).json({ erro: "Nota é obrigatória" });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ erro: "A nota deve ser entre 1 e 5" });
    }

    const compraExiste = db.prepare(`
      SELECT * FROM pagamento
      WHERE id_aluno = ? 
      AND id_videoaula = ? 
      AND status = 'concluido'
    `).get(id_aluno, id_videoaula);

    if (!compraExiste) {
      return res.status(400).json({ erro: "O aluno precisa ter pagamento concluído para avaliar" });
    }

    const resultado = db.prepare(`
      INSERT INTO avaliacao (id_aluno, id_videoaula, nota, comentario)
      VALUES (?, ?, ?, ?)
    `).run(id_aluno, id_videoaula, nota, comentario || "");

    res.status(201).json({
      mensagem: "Avaliação cadastrada com sucesso!",
      id_avaliacao: resultado.lastInsertRowid
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao avaliar aula" });
  }
});

// PUT - configurarFormaPagamento()
router.put("/:id_aluno/formaPagamento", (req, res) => {
  try {
    const { id_aluno } = req.params;
    const { formaPagamento } = req.body;

    if (!formaPagamento) {
      return res.status(400).json({ erro: "Forma de pagamento é obrigatória" });
    }

    const resultado = db.prepare(`
      UPDATE aluno
      SET formaPagamento = ?
      WHERE id_aluno = ?
    `).run(formaPagamento, id_aluno);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    res.status(200).json({
      mensagem: "Forma de pagamento configurada com sucesso!",
      formaPagamento
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao configurar forma de pagamento" });
  }
});

module.exports = router;