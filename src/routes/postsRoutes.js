import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
};

// Configura o armazenamento de arquivos para o upload de imagens
const storage = multer.diskStorage({
  // Define o diretório de destino para os arquivos carregados.
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Define o nome do arquivo no destino final.
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Define a instância do middleware Multer com o armazenamento configurado.
const upload = multer({ dest:"./uploads", storage});

// Função para definir as rotas da aplicação Express.
const routes = (app) => {
  // Permite que o servidor interprete requisições com corpo no formato JSON.
  app.use(express.json());

  app.use(cors(corsOptions));

  // Rota GET para buscar todos os posts (implementada em postsController.listarPosts)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (implementada em postsController.postarNovoPost)
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagem e criação de post 
  // (utiliza o middleware Multer e a função uploadImagem do controlador) 
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost);
};

export default routes;
