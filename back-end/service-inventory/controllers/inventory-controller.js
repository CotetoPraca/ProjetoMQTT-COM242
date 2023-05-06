/*
Salva localmente uma lista de serviços.
Não é necessário a remoção de serviços nessa aplicação por conta de sua simplicidade.
Nota: o ideal é ter os serviços salvos em um banco para sistemas mais complexos
*/
const services = [];

// Adiciona um serviço a lista de serviços
// Os serviços possuem as seguintes informações: nome, descrição, endpoint e handler (nome da sua função principal)
function addService(service) {
  console.log(`Serviço ${service.name} adicionado ao repositório`);
  services.push(service);
}

// Retorna todos os serviços disponíveis
function getAllServices() {
  return services;
}

// Encontra um serviço pelo nome
// O nome do serviço deve ser sempre igual ao nome do arquivo que o representa (sem a extensão)
function getServiceByName(name) {
  return services.find(service => service.name == name);
}

// Exporta as funções definidas no controlador
module.exports = {
  addService,
  getAllServices,
  getServiceByName
};
