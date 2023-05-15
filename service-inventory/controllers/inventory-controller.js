/** CONTROLADOR DE INVENTÁRIO
 * Salva localmente um dicionário de serviços.
 * Não é necessário a remoção de serviços nessa aplicação por conta de sua simplicidade.
 * Nota: o ideal é ter os serviços salvos em um banco para sistemas mais complexos
**/
const services = {};

// Adiciona um serviço ao dicionário de serviços
// Os serviços possuem as seguintes informações: nome, descrição, endpoint e handler (nome da sua função principal)
function addService(service) {
  console.log(`Serviço ${service.name} adicionado ao repositório`);
  services[service.name] = service;
}

// Retorna todos os serviços disponíveis
function getAllServices() {
  return Object.values(services);
}

// Encontra um serviço pelo nome
// O nome do serviço deve ser sempre igual ao nome do arquivo que o representa (sem a extensão)
function getServiceByName(name) {
  return services[name];
}

// Exporta as funções definidas no controlador
module.exports = {
  addService,
  getAllServices,
  getServiceByName
};
