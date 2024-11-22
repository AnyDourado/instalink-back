import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts.
// Chama a função do modelo para buscar os posts e envia a resposta em formato JSON.
export async function listarPosts (req, res) {
    // Busca todos os posts do banco de dados.
    const posts =  await getTodosPosts();

    // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
    res.status(200).json(posts);
}

// Função assíncrona para criar um novo post.
// Recebe os dados do novo post no corpo da requisição.
// Chama a função do modelo para criar o post e envia a resposta com o post criado.
export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        // Cria um novo post no banco de dados.
        const postCriado = await criarPost(novoPost);

        // Envia uma resposta HTTP com status 200 (OK) e o post criado como JSON.
        res.status(200).json(postCriado);
    } catch (erro) {
        // Loga o erro no console para depuração.
        console.error(erro.message);

        // Envia uma resposta HTTP com status 500 (Internal Server Error) e uma mensagem de erro genérica.
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post.
// Recebe os dados do novo post e o arquivo da imagem na requisição.
// Cria um novo post com a URL da imagem e salva a imagem no servidor.
export async function uploadImagem(req, res) {
    // Cria um objeto com os dados do novo post, incluindo a URL da imagem.
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname, // Considerar usar um nome único para a imagem
        alt: ""
    };
    try {
        // Cria um novo post no banco de dados.
        const postCriado = await criarPost(novoPost);

        // Constrói o caminho completo para a imagem salva.
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        
        // Move o arquivo da imagem para o destino final.
        fs.renameSync(req.file.path, imagemAtualizada)

        // Envia uma resposta HTTP com status 200 (OK) e o post criado como JSON.
        res.status(200).json(postCriado);
    } catch (erro) {
        // Loga o erro no console para depuração.
        console.error(erro.message);

        // Envia uma resposta HTTP com status 500 (Internal Server Error) e uma mensagem de erro genérica.
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}