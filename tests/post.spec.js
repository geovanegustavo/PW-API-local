/*
/ Executar primeiro o servidor local: npx json-server db.json
*/

const { test, expect } = require('@playwright/test');
const obterIdAleatorio = require('./funcoes_auxiliares/obterIdAleatorio.js');
const dadoFaker = require('./funcoes_auxiliares/criaPostagemRandomica.js');
const dadoJSON = require('./Data/enviaDado.json');


test.describe('Testando POST para api JsonPlaceHolder', () => {

    test('Teste de criação de post', async ({ request }) => {

        const idAleatorio = Math.floor(Math.random() * 10) + 1;

        const response = await request.post('http://localhost:3000/posts', {

            data: { // Passa os dados dentro da requisição via JSON
                'id' : idAleatorio.toString(),
                'title' : 'Carlos Adriano',
                'views' : 602
            },
            headers: {
                'Content-Type':'application/json'
            }

        });

        expect(response.status()).toBe(201);

    });

    test('Teste de criação de post via arquivo externo JSON', async ({ request }) => {

        const response = await request.post('http://localhost:3000/posts', {
            data: dadoJSON,
            headers: {
                'Content-Type':'application/json'
            }
        });

        expect(response.status()).toBe(201);

        const responseData = await response.json();
        console.log("Resposta retornada: ", responseData);

    });

    test.only('Teste de criação de post via arquivo faker', async ({ request }) => {

        const faker = await dadoFaker();

        const response = await request.post('http://localhost:3000/posts', {
            data: faker,
            headers: {
                'Content-Type':'application/json'
            }
        });

        expect(response.status()).toBe(201);

        const responseData = await response.json();
        console.log("Resposta retornada: ", responseData);

    });

});

