/** SERVIÇO DE RECEBIMENTO DE DADOS POR HTTP
 * Este serviço recebe dados por HTTP de um ambiente de origem especificado.
 * A função principal recebe como parâmetro as informações do endereço de origem
 * dos dados em formato JSON com as informações: hostname, port, path.
 * Após o recebimento dos dados, o serviço retorna uma mensagem de confirmação
 * ao endereço de origem e retorna os dados recebidos a quem solicitou o serviço.
**/
const inventoryController = require('../controllers/inventory-controller');
const http = require('http');

// Função principal do serviço de recebimento de dados
// Recebe o endereço de origem para receber os dados por HTTP
function receberDadosPorHTTP(origem) {
  const server = http.createServer((req, res) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const dadosRecebidos = JSON.parse(body);
      
      console.log('Dados recebidos:', dadosRecebidos);

      // Retorna os dados recebidos como resposta
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(dadosRecebidos));
    });
  });

  server.listen(origem.port, origem.hostname, () => {
    console.log(`Servidor de recebimento iniciado em ${origem.hostname}:${origem.port}`);
  });
}

// Adiciona o serviço de recebimento de dados ao repositório
inventoryController.addService({
  name: 'http-receive-data',
  description: 'Serviço de recebimento de dados por HTTP de um endereço de origem especificado',
  endpoint: '/http-receive-data',
  handler: receberDadosPorHTTP,
});

// Exporta as funções do serviço
module.exports = {
  receberDadosPorHTTP,
};
