const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir leitura de JSON em req.body
app.use(express.json());

// BANCO DE DADOS EM MEMÓRIA
let projetos = [
    {
        id:1,
        nomeProjeto: "Pizzaria John",
        cliente:"TOTVS",
        horasEstimadas:"Técnico em Desenvolvimento de Sistemas",
        orcamento:[50000.0]
    },
    {
        id:2,
        nomeProjeto: "Fábrica Têxtil",
        cliente:"Stefanini",
        horasEstimadas: [20],
        orcamento:[30000.0]
    },
    {
        id:3,
        nomeProjeto: "Celular Peças",
        cliente:"CI&T",
        horasEstimadas: [40],
        orcamento:[60000.0]
    }
]; 

//ROTA 1: GET  /projetoss(listar todos os projetos) status 200 ok
app.get('/projetos', (req, res) =>{
    return res.status(200).json(projetos);
});

//ROTA 2: Rota para buscar um projeto específico pelo ID (Parâmetro de Rota)
app.get('/projetos/:id', (req, res) => {
    const { id } = req.params; // Extrai o ID da URL
    // Procura o projeto no array em memória
    const projeto = projetos.find(p => p.id === parseInt(id));
    // Caso o produto não exista, retorna 404 Not Found
    if (!projeto) {
    return res.status(404).json({ mensagem: 'Pro não encontrado' });
    }

    // Se existir, retorna 200 OK com os dados do projeto encontrado
    return res.status(200).json(projeto);   
});

// OBRIGATÓRIO: Habilitar o parser de corp JSON no Express
app.use(express.json());

// Rota para Cadastrar um Novo Projeto
app.post('/projetos', (req, res) => {
    // Extrai as informações enviadas pelo cliente no corpo (body) na requisição
    const { nomeProjeto, cliente } = req.body;
    
    // Validação simples dos dados recebidos
    if (!nomeProjeto || cliente === undefined) {
        return res.status(400).json({ mensagem: 'Nome do Projeto e cliente são obrigatórios.' });
    }

    // Criação do novo registro com identificador único incremental
    const novoProjeto = {
        id: projetos.length > 0 ? projetos[projetos.length - 1].id + 1 : 1,
        nomeProjeto,
        cliente: String(cliente) 
    };

    projetos.push(novoProjeto);

    // RESful: Retorna HTTP Status 201 Created + Objeto Criado
    return res.status(201).json({
        mensagem: `Projeto cadastrado com sucesso!`,
        projeto: novoProjeto
    });
});

// Rota para Atualizar um Projeto Existente
app.put('/projetos/:id', (req, res) => {
    const { id } = req.params;       // ID na URL
    const { nomeProjeto, cliente } = req.body;

    // Localiza a posição do projeto no array
    const index = projetos.findIndex(p => p.id === parseInt(id));

    // Caso o projeto não exista no banco/memória
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Projeto não encontrado para atualização.' });
    }

    // CORREÇÃO AQUI: trocado 'nome' por 'nomeProjeto'
    projetos[index] = {
        ...projetos[index],
        nomeProjeto: nomeProjeto || projetos[index].nomeProjeto,
        cliente: cliente === undefined ? projetos[index].cliente : String(cliente)
    };

    // Retorna HTTP Status 200 OK com o registro atualizado
    return res.status(200).json({
        mensagem: `Projeto atualizado com sucesso`,
        projeto: projetos[index]
    });
});
// Rota para Deletar um Projeto pelo ID
app.delete('/projetos/:id', (req, res) => {
    const { id } = req.params;

    // Encontra a posição do item
    const index = projetos.findIndex(p => p.id === parseInt(id));

    // Se não existir, retorna 404 Not Found
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Projeto não encontrado para exclusão.' })
    }

    // Remove o elemento do array em memória
    projetos.splice(index, 1);

    // Retorna HTTP Status OK com mensagens de confirmação
    return res.status(200).json({
        mensagem: `Projeto com ID ${id} removido com sucesso!`
    });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

