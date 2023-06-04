/** SERVIÇO DE AUTENTICAÇÃO DE USUÁRIO
 * Esse serviço realiza a autenticação de um usuário com login e senha fixos no código.
 * Recebe como parâmetros o login e senha informados pelo usuário e verifica se correspondem aos valores fixos.
 * Caso a autenticação seja bem-sucedida, retorna um token de autenticação.
 * Nota: Foi usado valores fixos por queustões didáticas.
**/
const inventoryController = require('../controllers/inventory-controller');

// Valores fixos de login e senha
const loginFixo = 'admin';
const senhaFixa = 'admin';

// Função principal do serviço
// Recebe o login e senha informados pelo usuário e retorna um token de autenticação se a autenticação for bem-sucedida
function autenticarUsuario(login, senha) {
  if (login === loginFixo && senha === senhaFixa) {
    // Autenticação bem-sucedida
    const token = gerarToken();
    console.log(`Usuário autenticado com sucesso. Token: ${token}`);
    return token;
  } else {
    // Autenticação falhou
    console.log('Falha na autenticação. Login ou senha inválidos.');
    return null;
  }
}

// Função para gerar um token de autenticação simples
function gerarToken() {
  const timestamp = new Date().getTime();
  return `TOKEN-${timestamp}`;
}

// Adiciona o serviço ao repositório
inventoryController.addService({
  name: "auth-user",
  description: "Serviço de autenticação de usuário",
  endpoint: "/auth/user",
  handler: autenticarUsuario
});

// Exporta as funções do serviço
module.exports = {
  autenticarUsuario
};
