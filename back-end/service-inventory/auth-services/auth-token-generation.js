/** SERVIÇO DE GERAÇÃO DE TOKEN DE AUTENTICAÇÃO
 * Esse serviço gera um token aleatório de autenticação com vida útil pré-determinada.
 * Os tokens válidos serão armazenados localmente e gerenciados por outro serviço.
 * Nota 1: O serviço é dependente do serviço auth-token-storage para salvar o token
 * Nota 2: Foi usado valores fixos por questões didáticas.
**/
const inventoryController = require('../controllers/inventory-controller');
const validTokens = inventoryController.getServiceByName('auth-token-storage')

// Tempo de expiração do token (em milissegundos)
const tokenExpiration = 3600000; // 1 hora

// Função principal do serviço de geração de token de autenticação
function gerarToken() {
  const timestamp = new Date().getTime();
  const expiration = timestamp + tokenExpiration;
  const token = `TOKEN-${timestamp}`;
  inventoryController.getServiceByName('auth-token-storage').adicionarTokenValido(token, expiration);
  return token;
}

// Adiciona o serviço de geração de token de autenticação ao repositório
inventoryController.addService({
  name: "auth-token-generation",
  description: "Serviço de geração de token de autenticação",
  endpoint: "/auth/token/generation",
  handler: gerarToken
});

module.exports = {
  gerarToken
};