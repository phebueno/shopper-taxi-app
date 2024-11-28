# ShopperTaxi

**ShopperTaxi** é uma aplicação de **prova de conceito** para transporte particular, que permite aos usuários solicitar viagens, visualizar rotas e motoristas disponíveis, e consultar seu histórico de viagens.

## Sobre

O **ShopperTaxi** funciona de maneira semelhante a outras plataformas de transporte, como Uber, permitindo que o usuário informe sua **origem** e **destino** para encontrar a melhor rota e motoristas disponíveis. O mapa exibe as opções de trajeto e motoristas, permitindo que o usuário escolha o motorista desejado. Após a escolha, o usuário é redirecionado para uma página onde pode visualizar o histórico de suas viagens passadas.

**Nota:** Este projeto é uma **prova de conceito**, não sendo uma aplicação completa ou pronta para produção. Ele foi desenvolvido com o objetivo de demonstrar a funcionalidade básica de um serviço.

### Funcionalidades:
- **Seleção de Origem e Destino:** O usuário pode inserir a origem e o destino de sua viagem.
- **Exibição de Rota:** A rota mais eficiente entre origem e destino é exibida no mapa.
- **Motoristas Disponíveis:** Motoristas próximos são listados, e o usuário pode escolher com quem deseja viajar.
- **Histórico de Viagens:** Após finalizar a viagem, o usuário pode acessar seu histórico de viagens realizadas.

## Como Rodar

Para rodar a aplicação localmente, siga as etapas abaixo:

### Pré-requisitos

- **Node.js**:  Você pode baixar e instalar a versão mais recente do [Node.js](https://nodejs.org/).
- **Google Maps e Places API Key**: Para usar o recurso de mapas e rotas, você precisará de uma chave própria da API do Google. Siga atentamente [o guia passo-a-passo do Google](https://developers.google.com/maps/gmp-get-started) e ative os dois serviços, com a chave habilitada para ambos.
- **Docker**: A utilização dessa ferramenta foi facilitada com o uso de conteinerização pelo Docker, então é recomendado o seu uso.

### Passos para rodar:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/phebueno/shopper-taxi-app
   cd shopper-taxi-app

2. **Insira sua chave da API do Google no seu .env na raiz do projeto** (você também pode configurar as credenciais do banco seguindo o .**env.example**, mas não é necessário):

    ```bash
       GOOGLE_API_KEY=YOUR_API_KEY_HERE

3. **Inicie o docker com o usando o docker-compose.yml**:
    ```bash
       docker-compose up

4. **Teste a aplicação à vontade!**
