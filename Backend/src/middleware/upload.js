const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pasta =
      file.fieldname === "foto" ? "uploads/fotos" : "uploads/comprovantes";

    fs.mkdirSync(pasta, { recursive: true });

    cb(null, pasta);
  },

  filename: (req, file, cb) => {
    const nomeArquivo =
      Date.now() + path.extname(file.originalname);

    cb(null, nomeArquivo);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
