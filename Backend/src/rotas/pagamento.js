const express = require("express");
const router = express.Router();
const db = require("../database");

// GET - verTodosOsPagamentos()
router.get("/", (req, res) => {
  try {

    const pagamentos = db.prepare(`
      SELECT
        pagamento.id_pagamento,
        pagamento.valor,
        pagamento.status,
        pagamento.dataPagamento,

        aluno.id_aluno,
        usuario.nome AS nomeAluno,

        videoaula.id_videoaula,
        videoaula.titulo

      FROM pagamento

      INNER JOIN aluno
        ON pagamento.id_aluno = aluno.id_aluno

      INNER JOIN usuario
        ON aluno.id_usuario = usuario.id_usuario

      INNER JOIN videoaula
        ON pagamento.id_videoaula = videoaula.id_videoaula

      ORDER BY pagamento.id_pagamento DESC
    `).all();

    res.status(200).json({
      total: pagamentos.length,
      pagamentos
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({
      erro: "Erro ao listar pagamentos"
    });
  }
});

module.exports = router;