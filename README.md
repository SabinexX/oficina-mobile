📱 Sobre o Projeto

Aplicativo mobile da Mecânica Sabino desenvolvido em React Native com Expo.

O objetivo do aplicativo é facilitar o gerenciamento da oficina, permitindo:

Criar orçamentos automotivos
Gerar PDF para clientes
Controlar custos e lucros
Gerenciar peças e serviços
Futuramente integrar IA para busca de peças
Integração futura com backend Java + PostgreSQL
🚀 Tecnologias Utilizadas
Front-end Mobile
React Native
Expo
React Native Paper
React Navigation
📦 Instalações Realizadas
1️⃣ Criação do Projeto Expo

Comando utilizado:

npx create-expo-app@latest oficina
Motivo

O Expo facilita o desenvolvimento mobile, principalmente para testes rápidos no iPhone utilizando o aplicativo Expo Go.

2️⃣ Instalação do React Native Paper

Comando:

npm install react-native-paper
Motivo

Biblioteca de componentes visuais modernos para React Native.

Benefícios:

Visual mais profissional
Cards prontos
Botões estilizados
Inputs modernos
Melhor organização visual
3️⃣ Dependências do Paper

Comando:

npx expo install react-native-safe-area-context react-native-vector-icons react-native-screens react-native-gesture-handler react-native-reanimated
Motivo

Dependências necessárias para:

Ícones
Navegação
Compatibilidade iOS
Animações
Safe Area do iPhone
4️⃣ Instalação da Navegação

Comando:

npm install @react-navigation/native

E:

npm install @react-navigation/native-stack
Motivo

Permitir troca de telas no aplicativo.

Exemplo:

Home
Novo orçamento
Histórico
Clientes
