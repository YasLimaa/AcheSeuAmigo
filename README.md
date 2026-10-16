# AcheSeuAmigo

Aplicação web de demonstração para aproximar pessoas interessadas em adoção e animais que procuram um lar. O projeto permite explorar pets disponíveis, consultar seus perfis e registrar interesse em adoção.

> Projeto desenvolvido em equipe durante a graduação em Análise e Desenvolvimento de Sistemas (IFSP).

# Equipe 
- [Alberto Caetano](https://github.com/albertocaetano)
- [Roberto Dias](https://github.com/RobertoDias31)
- [Yasmin Lima](https://github.com/YasLimaa)

## Funcionalidades

- Listagem de animais com busca por nome ou raça e filtro por espécie.
- Página de detalhes de cada animal, com informações e dados do tutor.
- Cadastro e login de usuários.
- Cadastro de pets para adoção, incluindo imagem e informações como espécie, idade, porte e personalidade.
- Perfil do usuário para acompanhar pets cadastrados e solicitações de adoção.
- Edição e remoção de informações do perfil, dos pets e das solicitações.
- Layout desenvolvido com CSS e navegação entre páginas.

## Tecnologias

- React
- JavaScript
- React Router
- CSS
- `localStorage` para persistência local dos dados no navegador

> Este projeto é um protótipo front-end. Os dados são armazenados no navegador; não há integração com backend ou banco de dados remoto.

## Como executar

É necessário ter Node.js e npm instalados.

```bash
npm install
npm start
```

A aplicação será iniciada no ambiente de desenvolvimento, normalmente em `http://localhost:3000`.

## Scripts disponíveis

- `npm start`: inicia o servidor de desenvolvimento.
- `npm run build`: gera a versão de produção na pasta `build`.
- `npm test`: inicia o executor de testes do Create React App.

## Estrutura principal

```text
src/
├── components/   # Componentes reutilizáveis, como cabeçalho, rodapé e cartões
├── data/         # Dados iniciais de demonstração
├── pages/        # Páginas da aplicação
└── services/     # Operações locais de cadastro, login e adoção
public/           # Arquivos estáticos e imagens
```
