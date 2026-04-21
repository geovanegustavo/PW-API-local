/*
/ Executar primeiro o servidor local: npx json-server db.json
*/

const { test, expect } = require('@playwright/test');
const obterIdAleatorio = require('./funcoes_auxiliares/obterIdAleatorio.js');
const dadoFaker = require('./funcoes_auxiliares/criaPostagemRandomica.js');

let idAleatorio;

test.beforeAll(async ( { request } ) => {
    idAleatorio = await obterIdAleatorio( request ); // pega Id valido de post existente
});

test.describe ('Atualiza dados no JSON', async () => {

    const dadosAtualizados = await dadoFaker();

    test('Deve editar um post existente por ID', async ( { request } ) => {
    
        const response = await request.put(
            `http://localhost:3000/posts/${idAleatorio}`, {data : dadosAtualizados}
        );
        expect(response.status()).toBe(200);

        const responseData = await response.json();
        expect(responseData.id).not.toBe('');
        expect(responseData.title).not.toBe('');
        expect(responseData.view).not.toBe('');

        console.log("Resposta retornada: ", responseData);

    });

    test('Deve criar, atualizar e depois deletar o post', async ( { request } ) => {

        let createdPost;
        let updatedPost;
        
        await test.step('Cria post temporário', async () => {
            const createResponse = await request.post('http://localhost:3000/posts', {
                data: { title: 'Post criado para teste', views: 0 }
            });
            expect(createResponse.status()).toBe(201);
            createdPost = await createResponse.json();
        });

        await test.step('Atualiza post criado', async () => {
            const updatedResponse = await request.put(
                `http://localhost:3000/posts/${createdPost.id}`, 
                { data: { title: 'Post atualizado para teste', views: 5 } }
            );
            expect(updatedResponse.status()).toBe(200);
            updatedPost = await updatedResponse.json();
            expect(updatedPost.title).toBe('Post atualizado para teste');
            expect(updatedPost.views).toBe(5);
        });

        await test.step('Deleta post criado', async () => {
            const deleteResponse = await request.delete(`http://localhost:3000/posts/${createdPost.id}`);
            expect(deleteResponse.status()).toBe(200);
        });

    });

});