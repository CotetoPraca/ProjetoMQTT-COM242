/** SERVIÇO DE ARMAZENAMENTO DE TOKEN DE AUTENTICAÇÃO
 * Esse serviço gerencia os token de autenticação armazenados.
 * O serviço pode incluir, excluir ou validar o token.
 * A criação do token é feita por outro serviço.
 * Nota: Foi usado valores fixos por questões didáticas.
**/
const inventoryController = require('../controllers/inventory-controller');

// Armazenamento dos tokens válidos
const validTokens = new Map();

// Função para adicionar um token válido ao armazenamento
function adicionarTokenValido(token, expiration) {
  validTokens.set(token, expiration);
}

// Função para remover um token válido do armazenamento
function removerTokenValido(token) {
  validTokens.delete(token);
}

// Função principal para verificar se um token é válido e não expirou
function verificarTokenValido(token) {
  if (validTokens.has(token)) {
    const expiration = validTokens.get(token);
    if (expiration > new Date().getTime()) {
      // Token válido e não expirado
      return true;
    } else {
      // Token expirado
      validTokens.delete(token);
    }
  }
  return false;
}

// Adiciona o serviço de armazenamento de tokens ao repositório
// Como o serviço possui 3 funcionalidades, optou-se por não possuir um "handler"
inventoryController.addService({
  name: "auth-token-storage",
  description: "Serviço de armazenamento e gerenciamento de tokens",
  endpoint: "/auth/token/storage",
  verificarTokenValido,
  adicionarTokenValido,
  removerTokenValido
});

module.exports = {
  adicionarTokenValido,
  removerTokenValido,
  verificarTokenValido
};

