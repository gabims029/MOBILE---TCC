1 - Projeto Mobile - React Native
Este repositório contém a aplicação mobile do sistema de gerenciamento de reservas de salas de aula. Foi desenvolvido em React Native para permitir que usuários consultem e gerenciem reservas diretamente pelo celular.

2 - Objetivo da Sprint
Desenvolver a interface mobile para interagir com a API de reservas.
Implementar autenticação de usuários (login/logout).
Permitir visualização, criação, atualização e exclusão de reservas.
Aplicar componentes reutilizáveis e boas práticas de desenvolvimento (Clean Code).

3 - Tecnologias Utilizadas
React Native
Expo
Axios (para requisições HTTP)
React Navigation (para navegação entre telas)
SecureStore (armazenamento seguro de tokens de autenticação)
Material UI / Componentes customizados
Instalação do Projeto Mobile

4 - Clone o repositório:
git clone (https://github.com/gabims029/MOBILE---TCC.git)


5 - Instale as dependências:
npm install

6 - Inicie o projeto com Expo:
npm expo start

7 - Abra no seu emulador ou dispositivo físico usando o QR code gerado.

8 - Funcionalidades Principais
Autenticação
Login e logout de usuários.
Armazenamento seguro do token de acesso.
Reservas
Visualizar todas as reservas.
Visualizar reservas do usuário logado.
Criar, atualizar e deletar reservas.
Salas de Aula
Consultar lista de salas de aula disponíveis.
Consultar detalhes de uma sala específica.
Perfil do Usuário
Visualizar e atualizar informações do usuário.
Excluir conta.

9 - Estrutura do Projeto
screens/ → Telas principais do aplicativo (Login, Home, Reservas, Perfil)
components/ → Componentes reutilizáveis (Botões, Modais, Cards)
services/ → Conexão com a API (Axios) e funções de requisição
navigation/ → Configuração de rotas e navegação
assets/ → Imagens e ícones utilizados no app

10 - Observações Importantes
Certifique-se de que a API esteja rodando antes de usar o app.
Algumas funcionalidades dependem do tipo de usuário (administrador ou comum).
Todos os dados sensíveis são armazenados localmente de forma segura usando SecureStore.