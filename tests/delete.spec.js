/*
/ Executar primeiro o servidor local: npx json-server db.json
*/

const { test, expect } = require('@playwright/test');

test.describe('Fluxo de criação e exclusão de posts', () => {

    test('Deve criar e depois deletar um post', async ({ request }) => {

        // 1. Cria um post temporário
        const createResponse = await request.post('http://localhost:3000/posts', {
            data: { title: 'Post temporário para teste', views: 0 }
        });
        expect(createResponse.status()).toBe(201);

        const createdPost = await createResponse.json();
        console.log("Post criado:", createdPost);

        // 2. Deleta o post criado
        const deleteResponse = await request.delete(`http://localhost:3000/posts/${createdPost.id}`);
        expect(deleteResponse.status()).toBe(200);

        const deletedPost = await deleteResponse.json();
        console.log("Post deletado:", deletedPost);

        // 3. Valida que o post não existe mais
        const checkResponse = await request.get(`http://localhost:3000/posts/${createdPost.id}`);
        console.log("Resposta: ", checkResponse);
        expect(checkResponse.status()).toBe(404);

    });

});
