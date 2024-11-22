import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados utilizando a string de conexão fornecida pela variável de ambiente.
// A função `conectarAoBanco` é importada de `dbConfig.js` e retorna uma conexão com o banco de dados.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para buscar todos os posts do banco de dados.
export async function getTodosPosts() {
    // Seleciona o banco de dados "imersao-istabytes" dentro da conexão estabelecida.
    const db = conexao.db("imersao-istabytes");

    // Seleciona a coleção "posts" dentro do banco de dados selecionado.
    const colecao = db.collection("posts");

    // Executa uma operação de busca em toda a coleção "posts" e retorna todos os documentos como um array.
    return colecao.find().toArray();
}

export async function criarPost(novoPost) {
    // Seleciona o banco de dados "imersao-istabytes" dentro da conexão estabelecida.
    const db = conexao.db("imersao-istabytes");

    // Seleciona a coleção "posts" dentro do banco de dados selecionado.
    const colecao = db.collection("posts");

    // Insere um novo documento (novoPost) na coleção "posts" e retorna um objeto com informações sobre a operação de inserção.
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    // Seleciona o banco de dados "imersao-istabytes" dentro da conexão estabelecida.
    const db = conexao.db("imersao-istabytes");

    // Seleciona a coleção "posts" dentro do banco de dados selecionado.
    const colecao = db.collection("posts");

    const objID = ObjectId.createFromHexString(id);

    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}
