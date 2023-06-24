/** SERVIÇO DE ENVIO DE DADOS POR HTTP
 * Este serviço envia dados por HTTP para um ambiente de destino especificado.
 * A função principal recebe como parâmetro os dados a serem enviados e 
 * o destino desses dados. O endereço deve estar no formato JSON com as
 * seguintes informações: hostname, port, path.
 * Após o envio dos dados, o serviço aguardará o retorno de uma mensagem  
 * de confirmação.
**/
const inventoryController = require('../controllers/inventory-controller');
const http = require('http');

// Função principal do serviço de envio de dados
// Recebe o endereço de destino e os dados a serem enviados por HTTP
function enviarDadosPorHTTP(destino, dados) {
  const options = {
    hostname: destino.hostname,
    port: destino.port,
    path: destino.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('Dados enviados com sucesso!');
      // Aqui você pode implementar a lógica para lidar com a mensagem de confirmação, se necessário
    } else {
      console.error(`Erro ao enviar os dados. Código de resposta: ${res.statusCode}`);
    }
  });

  req.on('error', (error) => {
    console.error('Erro na requisição HTTP:', error);
  });

  req.write(JSON.stringify(dados));
  req.end();
}

// Adiciona o serviço de envio de dados ao repositório
inventoryController.addService({
  name: 'http-send-data',
  description: 'Serviço de envio de dados por HTTP a um endereço de destino especificado',
  endpoint: '/http/send-data',
  handler: enviarDadosPorHTTP,
});

// Exporta as funções do serviço
module.exports = {
  enviarDadosPorHTTP,
};
