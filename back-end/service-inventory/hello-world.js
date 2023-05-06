/*
Esse serviço serve para imprimir o texto "Hello World" no console.
É apenas um serviço de teste.
*/
const inventoryController = require('./controllers/inventory-controller');

// Função principal do serviço
function helloWorld() {
  console.log("Hello World");
}

// Adiciona o serviço ao repositório local
inventoryController.addService({
  name: "hello-world",
  description: "Serviço que imprime 'Hello World' no console",
  endpoint: "/hello-world",
  handler: "helloWorld"
});

// Exporta as funções do serviço
module.exports = {
  helloWorld
};