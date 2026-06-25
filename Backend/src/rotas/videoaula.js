const express = require("express");
const router = express.Router();
const db = require("../database");

// POST- validarPublicacao()
  // Verifica se a videoaula está pronta para publicação, em analise se vai continuar aqui, porém talvez seja aproveitado 
  // na hora do Frontend 
router.post("/validarPublicacao", (req, res) => {
  try {
    const { titulo, descricao, valor, gratuito, id_professor, linkTumblr, thumbnailUrl } = req.body;

    if (!titulo || !id_professor || gratuito === undefined) {
      return res.status(400).json({ erro: "Título, id_professor e gratuito são obrigatórios" });
    }

    const professorExiste = db
      .prepare("SELECT * FROM professor WHERE id_professor = ?")
      .get(id_professor);

    if (!professorExiste) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }

    if (gratuito !== "sim" && gratuito !== "não" && gratuito !== "nao") {
      return res.status(400).json({ erro: "Gratuito deve ser sim ou não" });
    }

    if ((gratuito === "não" || gratuito === "nao") && (!valor || valor <= 0)) {
      return res.status(400).json({ erro: "Videoaula paga precisa ter valor maior que zero" });
    }

    res.status(200).json({
      mensagem: "Videoaula validada com sucesso!",
      titulo,
      descricao: descricao || "",
      linkTumblr: linkTumblr || "",
      thumbnailUrl: thumbnailUrl || "",
      gratuito,
      valor: gratuito === "sim" ? 0 : valor,
      id_professor
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao validar publicação" });
  }
});

// PUT- atualizarInformacoes()
// Atualiza título, descrição, valor e gratuito da videoaula
router.put("/:id_videoaula", (req, res) => {
  try {
    const { id_videoaula } = req.params;
    let { titulo, descricao, valor, gratuito, linkTumblr, thumbnailUrl } = req.body;

    if (!titulo || gratuito === undefined) {
      return res.status(400).json({ erro: "Título e gratuito são obrigatórios" });
    }

    if (gratuito === "sim") {
      gratuito = 1;
      valor = 0;
    } else if (gratuito === "não" || gratuito === "nao") {
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
    `).run(titulo, descricao || "", linkTumblr || "", thumbnailUrl || "", valor, gratuito, id_videoaula);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Videoaula não encontrada" });
    }

    res.status(200).json({
      mensagem: "Informações da videoaula atualizadas com sucesso!",
      id_videoaula,
      titulo,
      descricao: descricao || "",
      gratuito: gratuito === 1 ? "sim" : "não",
      valor
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao atualizar informações da videoaula" });
  }
});

// GET - verTodasAsVideoAulas()
router.get("/", (req, res) => {
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
      INNER JOIN professor
        ON videoaula.id_professor = professor.id_professor
      INNER JOIN usuario
        ON professor.id_usuario = usuario.id_usuario
    `).all();

    res.status(200).json({
      total: videoaulas.length,
      videoaulas
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao listar videoaulas" });
  }
});

module.exports = router;
