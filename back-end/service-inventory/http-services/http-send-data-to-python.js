/** SERVIÇO DE ENVIO DE DADOS POR HTTP
 * Este serviço envia dados por HTTP para o ambiente Python.
 * A função principal recebe como parâmetro os dados a serem enviados e 
 * o destino desses dados. O endereço deve estar no formato JSON com as
 * seguintes informações: hostname, port, path.
 * Após o envio dos dados, o serviço aguardará o retorno de uma mensagem  
 * de confirmação.
**/
const inventoryController = require('../controllers/inventory-controller');
const http = require('http');

// Função principal do serviço de envio de dados para o Python
// Recebe as informações a serem enviadas como JSON para o Python
function enviarDadosParaPython(dados, sistemaPython) {
  const options = {
    hostname: sistemaPython.hostname, // Endereço IP do servidor
    port: sistemaPython.port,         // Porta em que o servidor está ouvindo
    path: sistemaPython.path,         // Caminho do endpoint no servidor
    method: 'POST',                   // Método HTTP a ser usado
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Resposta do Python:', data);
      const resposta = JSON.parse(data);
      
      if (resposta.status === 'success') {
        console.log('Operação concluída com sucesso');
      } else if (resposta.status === 'error') {
        console.error('Ocorreu um erro:', resposta.message);
      } else { // Resposta inesperada
        console.warn('Resposta desconhecida do Python');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Erro ao enviar dados para o Python:', error);
  });

  req.write(JSON.stringify(dados));
  req.end();
}

// Adiciona o serviço de envio de dados para o Python ao repositório
inventoryController.addService({
  name: 'http-send-data-to-python',
  description: 'Serviço para enviar dados como JSON para o Python',
  endpoint: '/http/send-data-to-python',
  handler: enviarDadosParaPython,
});

// Exporta as funções do serviço
module.exports = {
  enviarDadosParaPython,
};
