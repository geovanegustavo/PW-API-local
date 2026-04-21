/*
/ Executar primeiro o servidor local: npx json-server db.json
*/

const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const obterIdAleatorio = require('./funcoes_auxiliares/obterIdAleatorio.js');

let idAleatorio;

test.beforeAll(async ({ request }) => {
    // Pegar id aleatório
    idAleatorio = await obterIdAleatorio(request);
});

test.describe('Testando GET para api JsonPlaceHolder', () => {

    test('Listar todas as postagens', async ({ request }) => {
        const response = await request.get('http://localhost:3000/posts');
        const data = await fs.readFile('db.json', 'utf8');
        const posts = JSON.parse(data).posts;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(posts)).toBe(true);
        expect(posts.length).toBeGreaterThan(0);

        posts.forEach(postagem => {
            expect(postagem).toHaveProperty('id');
            expect(postagem).toHaveProperty('title');
            expect(postagem).toHaveProperty('views');
            expect(typeof postagem.id).toBe('string');
            expect(typeof postagem.title).toBe('string');
            expect(typeof postagem.views).toBe('number');
        });

        const responseData = await response.json();
        console.log("Resposta: ", responseData);
    });

    test('Listar todos os comentários', async ({ request }) => {
        const response = await request.get('http://localhost:3000/comments');
        const data = await fs.readFile('db.json', 'utf8');
        const comments = JSON.parse(data).comments;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(0);

        comments.forEach(comentario => {
            expect(comentario).toHaveProperty('id');
            expect(comentario).toHaveProperty('text');
            expect(comentario).toHaveProperty('postId');

            expect(typeof comentario.id).toBe('string');
            expect(typeof comentario.text).toBe('string');
            expect(typeof comentario.postId).toBe('string');
        });

        const responseData = await response.json();
        console.log("Resposta: ", responseData);
    });

    test('Listar postagem por Id aleatório', async ({ request }) => {

        const response = await request.get(`http://localhost:3000/posts/${idAleatorio}`);
        const data = await fs.readFile('db.json', 'utf8');
        const posts = JSON.parse(data).posts;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

        posts.forEach(postagem => {
            expect(postagem).toHaveProperty('id');
            expect(postagem).toHaveProperty('title');
            expect(postagem).toHaveProperty('views');
            expect(typeof postagem.id).toBe('string');
            expect(typeof postagem.title).toBe('string');
            expect(typeof postagem.views).toBe('number');
        });

        console.log(`Postagem ${idAleatorio} validada.`);
    });

    test('Listar todos os perfis', async ({ request }) => {

        const response = await request.get('http://localhost:3000/posts');
        const data = await fs.readFile('db.json', 'utf8');
        const profile = JSON.parse(data).profile;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(profile).toHaveProperty('name');
        expect(typeof profile.name).toBe('string');

    });

    test('Teste de rota inexistente', async ({ request }) => {

        const response = await request.get('http://localhost:3000/rota-invalida');
        expect(response.status()).toBe(404);

        if(response.status() === 404) {
            console.log('Rota inexistente!', 'Status: ' + response.status());
        } else {
            throw new Error('Status: ' + response.status());
        }

    });

    test.skip('Teste de requisição de cabeçalho inválida', async ({ request }) => {

        // Como o verbo é um Get não teria que passar cabeçalho, pois cabeçalho passa no post
        const response = await request.get('http://localhost:3000/posts', {
            headers: {
                'Content-Type': 'invalid/type'
            }
        });

        expect(response.status()).toBe(404); // ou o status esperado para cabeçalho inválido

    });


});
