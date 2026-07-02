const express = require("express");
const router = express.Router();
const db = require("../database");
const upload = require("../middleware/upload");

// POST- Adicionar videoaula
router.post("/:id_professor/videoaula", (req, res) => {
  try {
    const { id_professor } = req.params;
    let { titulo, descricao, valor, gratuito, linkTumblr, thumbnailUrl } = req.body;

    if (!titulo || gratuito === undefined) {
      return res.status(400).json({ erro: "Título e gratuito são obrigatórios" });
    }

    const professor = db
      .prepare("SELECT * FROM professor WHERE id_professor = ?")
      .get(id_professor);

    if (!professor) {
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

    if (professor.statusValidacao === 'pendente' && gratuito === 0) {
      return res.status(400).json({
        erro: "Professores pendentes só podem publicar videoaulas gratuitas"
      });
    }

    const resultado = db.prepare(`
      INSERT INTO videoaula (id_professor, titulo, descricao, linkTumblr, thumbnailUrl, valor, gratuito)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id_professor,
      titulo,
      descricao || "",
      linkTumblr || "",
      thumbnailUrl || "",
      valor,
      gratuito
    );

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
    let { titulo, descricao, valor, gratuito, linkTumblr, thumbnailUrl } = req.body;

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
      SET titulo = ?, descricao = ?, linkTumblr = ?, thumbnailUrl = ?, valor = ?, gratuito = ?
      WHERE id_videoaula = ?
    `).run(
      titulo,
      descricao || "",
      linkTumblr || "",
      thumbnailUrl || "",
      valor,
      gratuito,
      id_videoaula
    );

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
        descricao,
        linkTumblr,
        thumbnailUrl,
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

// PATCH- Editar biografia do professor
router.patch("/:id_professor/biografia", (req, res) => {
  try {
    const { id_professor } = req.params;
    const { nome, faculdade, dataNascimento, cidade, biografia } = req.body;

    const professor = db
      .prepare(`
        SELECT professor.*, usuario.nome
        FROM professor
        INNER JOIN usuario ON professor.id_usuario = usuario.id_usuario
        WHERE professor.id_professor = ?
      `)
      .get(id_professor);

    if (!professor) {
      return res.status(404).json({ erro: "Professor nao encontrado" });
    }

    if (nome !== undefined) {
      const nomeTratado = String(nome).trim();

      if (!nomeTratado) {
        return res.status(400).json({ erro: "Nome e obrigatorio" });
      }

      db.prepare(`
        UPDATE usuario
        SET nome = ?
        WHERE id_usuario = ?
      `).run(nomeTratado, professor.id_usuario);
    }

    db.prepare(`
      UPDATE professor
      SET faculdade = ?,
          dataNascimento = ?,
          cidade = ?,
          biografia = ?
      WHERE id_professor = ?
    `).run(
      faculdade || "",
      dataNascimento || "",
      cidade || "",
      biografia || "",
      id_professor
    );

    const professorAtualizado = db.prepare(`
      SELECT
        professor.id_professor,
        professor.id_usuario,
        usuario.nome,
        usuario.email,
        professor.foto,
        professor.biografia,
        professor.faculdade,
        professor.dataNascimento,
        professor.cidade,
        professor.saldoComissao,
        professor.listaVideoAulas,
        professor.statusValidacao
      FROM professor
      INNER JOIN usuario ON professor.id_usuario = usuario.id_usuario
      WHERE professor.id_professor = ?
    `).get(id_professor);

    res.status(200).json({
      mensagem: "Biografia do professor atualizada com sucesso!",
      professor: professorAtualizado
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao atualizar biografia do professor" });
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

// POST- enviar comprovante de professor
router.post(
  "/:id_professor/comprovante",
  upload.single("documento"),
  (req, res) => {
    try {
      const { id_professor } = req.params;

      const professor = db
        .prepare(
          "SELECT * FROM professor WHERE id_professor = ?"
        )
        .get(id_professor);

      if (!professor) {
        return res
          .status(404)
          .json({ erro: "Professor não encontrado" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ erro: "Arquivo obrigatório" });
      }

      const caminhoArquivo =
        "uploads/comprovantes/" + req.file.filename;

      db.prepare(`
        UPDATE professor
        SET documentoComprovacao = ?,
            statusValidacao = 'pendente'
        WHERE id_professor = ?
      `).run(caminhoArquivo, id_professor);

      res.status(200).json({
        mensagem: "Comprovante enviado com sucesso",
        arquivo: caminhoArquivo,
      });

    } catch (erro) {
      console.log(erro);
      res.status(500).json({
        erro: "Erro ao enviar comprovante",
      });
    }
  }
);

// POST- enviar foto de perfil do professor
router.post(
  "/:id_professor/foto",
  upload.single("foto"),
  (req, res) => {
    try {
      const { id_professor } = req.params;

      const professor = db
        .prepare("SELECT * FROM professor WHERE id_professor = ?")
        .get(id_professor);

      if (!professor) {
        return res
          .status(404)
          .json({ erro: "Professor nao encontrado" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ erro: "Foto obrigatoria" });
      }

      const caminhoArquivo =
        "uploads/fotos/" + req.file.filename;

      db.prepare(`
        UPDATE professor
        SET foto = ?
        WHERE id_professor = ?
      `).run(caminhoArquivo, id_professor);

      res.status(200).json({
        mensagem: "Foto enviada com sucesso",
        foto: caminhoArquivo,
      });

    } catch (erro) {
      console.log(erro);
      res.status(500).json({
        erro: "Erro ao enviar foto",
      });
    }
  }
);

// PUT- Aprovar professor
router.put("/:id_professor/aprovar", (req, res) => {
  db.prepare(`
    UPDATE professor
    SET statusValidacao = 'aprovado'
    WHERE id_professor = ?
  `).run(req.params.id_professor);

  res.json({
    mensagem: "Professor aprovado"
  });
});

module.exports = router;
