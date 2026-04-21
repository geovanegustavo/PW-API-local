// Import do módulo file system do Node.js
const fs = require('fs').promises;

async function obterIdAleatorio(request) {

    try{
        const response = await request.get('http://localhost:3000/posts');

        if (!response.ok()){
            throw new Error("Erro ao obter posts");
        }

        const data = await fs.readFile('db.json', 'utf8');
        const posts = JSON.parse(data).posts;

        posts.forEach(posts => {
            console.log("Post: ", posts);
        });

        if (!posts || posts.length === 0) {
            throw new Error("Nenhum post encontrado.");
        }

        // Escolhe um número aleatório entre 0 e o tamanho da lista de posts.
        const randomIndex = Math.floor(Math.random() * posts.length);
        // Pega o post que caiu nesse número aleatório e devolve o id dele.
        return posts[randomIndex].id;

    } catch (error) {
        console.error("Erro ao obter Id aleatório", error);
        throw error;
    }

}

module.exports = obterIdAleatorio;