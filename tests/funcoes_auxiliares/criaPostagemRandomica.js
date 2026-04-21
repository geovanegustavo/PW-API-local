// https://fakerjs.dev/guide/

import { faker } from '@faker-js/faker';

async function geraUsuarioAleatorio() {

    // retorna objeto de configuração
    const randomId = faker.number.int( { min:50, max:100 } );
    const randomTitle = faker.lorem.sentence();
    const randomViews = faker.number.int( { min:50, max:100 } );

    return {
        "id": randomId,
        "title": randomTitle,
        "views": randomViews
    }
    
}

module.exports = geraUsuarioAleatorio;