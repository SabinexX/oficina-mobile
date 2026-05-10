# Oficina Sabino - Frontend Mobile

Aplicativo mobile da Oficina Sabino, desenvolvido com React Native e Expo.

## Tecnologias

- React Native
- Expo
- React Navigation
- React Native Paper
- Expo Image Picker

## Funcionalidades atuais

- Tela Home
- Cadastro de clientes
- Cadastro de carros
- Cadastro de várias fotos do veículo
- Tela de orçamento
- Tela de histórico
- Tela visual de busca de peças com IA

## Tela de carros

Permite cadastrar veículos com:

- cliente
- placa
- modelo
- marca
- ano
- várias fotos do carro
- fotos pela câmera
- fotos pela galeria

As fotos ainda ficam no estado local do aplicativo.

## Tela de busca de peças com IA

Protótipo visual para:

- digitar a placa do veículo
- simular dados do carro
- pesquisar peça desejada
- listar opções de compra
- comparar preço, marca e loja
- abrir link do produto

No momento ainda não usa IA real nem API externa.

## Como rodar

Instale as dependências:

```bash
npm install

Instale o Image Picker:

npx expo install expo-image-picker

Rode o projeto:

npx expo start

Depois escolha:

a - abrir no Android
w - abrir no navegador
ou escanear o QR Code pelo Expo Go
Estrutura básica
src/
├── components/
├── routes/
├── screens/
├── styles/
└── utils/
Integração futura com backend

O app será conectado ao backend Kotlin/Spring Boot usando requisições HTTP.

Fluxo esperado:

React Native
↓
Axios ou Fetch
↓
Spring Boot
↓
PostgreSQL
Próximos passos
Conectar cadastro de clientes ao backend
Conectar cadastro de veículos ao backend
Enviar fotos para o backend
Criar orçamento real
Criar histórico real
Selecionar fotos para fechamento
Gerar PDF de fechamento
Integrar IA real para busca de peças
Autor

Projeto desenvolvido por Bruno Sabino.

Sistema pensado para a Mecânica Sabino.
