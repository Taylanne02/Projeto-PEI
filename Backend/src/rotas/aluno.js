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
        videoaula.linkTumblr,
        videoaula.thumbnailUrl,
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
router.post("/:id_aluno/comprar/:id_videoaula", (req, res) => {
  try {
    const { id_aluno, id_videoaula } = req.params;
    const { formaPagamento } = req.body;

    if (!formaPagamento) {
      return res.status(400).json({
        erro: "Forma de pagamento é obrigatória"
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
      return res.status(400).json({
        erro: "Aluno já comprou essa videoaula"
      });
    }

    const valorFinal = videoaula.gratuito === 1
      ? 0
      : videoaula.valor;

    const pagamento = db.prepare(`
      INSERT INTO pagamento (
        id_aluno,
        id_videoaula,
        valor,
        status,
        dataPagamento
      )
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

    res.status(500).json({
      erro: "Erro ao comprar videoaula"
    });
  }
});

// DELETE - cancelarAula()
router.delete("/:id_aluno/cancelar/:id_videoaula", (req, res) => {
  try {

    const { id_aluno, id_videoaula } = req.params;

    const pagamento = db.prepare(`
      SELECT * FROM pagamento
      WHERE id_aluno = ?
      AND id_videoaula = ?
      AND status = 'concluido'
    `).get(id_aluno, id_videoaula);

    if (!pagamento) {
      return res.status(404).json({
        erro: "Pagamento não encontrado"
      });
    }

    const videoaula = db.prepare(`
      SELECT * FROM videoaula
      WHERE id_videoaula = ?
    `).get(id_videoaula);

    db.prepare(`
      UPDATE pagamento
      SET status = 'cancelado'
      WHERE id_pagamento = ?
    `).run(pagamento.id_pagamento);

    db.prepare(`
      UPDATE videoaula
      SET totalVendas = totalVendas - 1
      WHERE id_videoaula = ?
      AND totalVendas > 0
    `).run(id_videoaula);

    if (videoaula.gratuito === 0) {

      const comissaoProfessor = pagamento.valor * 0.7;

      db.prepare(`
        UPDATE professor
        SET saldoComissao = saldoComissao - ?
        WHERE id_professor = ?
      `).run(comissaoProfessor, videoaula.id_professor);
    }

    res.status(200).json({
      mensagem: "Compra cancelada com sucesso!",
      status: "cancelado"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro ao cancelar compra"
    });
  }
});

module.exports = router;
