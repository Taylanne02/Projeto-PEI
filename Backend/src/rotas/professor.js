const express = require("express");
const router = express.Router();
const db = require("../database");

// POST- Adicionar videoaula
router.post("/:id_professor/videoaula", (req, res) => {
  try {
    const { id_professor } = req.params;
    let { titulo, descricao, valor, gratuito } = req.body;

    if (!titulo || gratuito === undefined) {
      return res.status(400).json({ erro: "Título e gratuito são obrigatórios" });
    }

    const professorExiste = db
      .prepare("SELECT * FROM professor WHERE id_professor = ?")
      .get(id_professor);

    if (!professorExiste) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }

    if (gratuito === "sim") {
      gratuito = 1;
      valor = 0;
    } else if (gratuito === "nao" || gratuito === "não") {
      gratuito = 0;

      if (!valor || valor <= 0) {
        return res.status(400).json({ erro: "Informe um valor maior que zero" });
      }
    } else {
      return res.status(400).json({ erro: "Gratuito deve ser sim ou não" });
    }

    const resultado = db.prepare(`
      INSERT INTO videoaula (id_professor, titulo, descricao, valor, gratuito)
      VALUES (?, ?, ?, ?, ?)
    `).run(id_professor, titulo, descricao || "", valor, gratuito);

    res.status(201).json({
      mensagem: "Videoaula adicionada com sucesso!",
      id_videoaula: resultado.lastInsertRowid,
      gratuito: gratuito === 1 ? "sim" : "não",
      valor
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao adicionar videoaula" });
  }
});

// PUT- Editar videoaula
router.put("/videoaula/:id_videoaula", (req, res) => {
  try {
    const { id_videoaula } = req.params;
    let { titulo, descricao, valor, gratuito } = req.body;

    if (!titulo || gratuito === undefined) {
      return res.status(400).json({ erro: "Título e gratuito são obrigatórios" });
    }

    if (gratuito === "sim") {
      gratuito = 1;
      valor = 0;
    } else if (gratuito === "nao" || gratuito === "não") {
      gratuito = 0;

      if (!valor || valor <= 0) {
        return res.status(400).json({ erro: "Informe um valor maior que zero" });
      }
    } else {
      return res.status(400).json({ erro: "Gratuito deve ser sim ou não" });
    }

    const resultado = db.prepare(`
      UPDATE videoaula
      SET titulo = ?, descricao = ?, valor = ?, gratuito = ?
      WHERE id_videoaula = ?
    `).run(titulo, descricao || "", valor, gratuito, id_videoaula);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Videoaula não encontrada" });
    }

    res.status(200).json({
      mensagem: "Videoaula editada com sucesso!",
      gratuito: gratuito === 1 ? "sim" : "não",
      valor
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao editar videoaula" });
  }
});

// DELETE- Remover videoaula
router.delete("/videoaula/:id_videoaula", (req, res) => {
  try {
    const { id_videoaula } = req.params;

    const resultado = db
      .prepare("DELETE FROM videoaula WHERE id_videoaula = ?")
      .run(id_videoaula);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Videoaula não encontrada" });
    }

    res.status(200).json({ mensagem: "Videoaula removida com sucesso!" });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao remover videoaula" });
  }
});

// GET- Acompanhar vendas do professor
router.get("/:id_professor/vendas", (req, res) => {
  try {
    const { id_professor } = req.params;

    const videoaulas = db.prepare(`
      SELECT 
        id_videoaula,
        titulo,
        valor,
        gratuito,
        totalVendas
      FROM videoaula
      WHERE id_professor = ?
    `).all(id_professor);

    const totalVendas = videoaulas.reduce((total, aula) => {
      return total + aula.totalVendas;
    }, 0);

    const saldoComissao = db //a comissão vai ocorrer no aluno.js, no na função comprarVideoaula, onde vai calcular a comissão
                            //calcular e jogar na tabela professores, aqui server só de visualização
      .prepare("SELECT saldoComissao FROM professor WHERE id_professor = ?")
      .get(id_professor);

    res.status(200).json({
      id_professor,
      totalVendas,
      saldoComissao: saldoComissao ? saldoComissao.saldoComissao : 0,
      videoaulas
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao acompanhar vendas" });
  }
});

// GET- verTodosOsProfessores()
router.get("/", (req, res) => {
  try {
    const professores = db.prepare(`
      SELECT * FROM professor INNER JOIN usuario ON professor.id_usuario = usuario.id_usuario ORDER BY professor.id_professor DESC;
    `).all();

    res.status(200).json({
      total: professores.length,
      professores
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao listar professores" });
  }
});

module.exports = router;