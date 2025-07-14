# Projeto de Testes de API com PactumJS

<!-- Badges -->
<p align="center">
  <!-- ATENÇÃO: Substitua <SEU_USUARIO> e <SEU_REPOSITORIO> pelos seus dados do GitHub -->
  <a href="https://www.npmjs.com/package/pactum"><img src="https://img.shields.io/npm/v/pactum.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://github.com/<SEU_USUARIO>/<SEU_REPOSITORIO>/actions"><img src="https://github.com/<SEU_USUARIO>/<SEU_REPOSITORIO>/workflows/CI/badge.svg" alt="Build Status"></a>
  <a href="https://github.com/<SEU_USUARIO>/<SEU_REPOSITORIO>/blob/main/LICENSE"><img src="https://img.shields.io/github/license/<SEU_USUARIO>/<SEU_REPOSITORIO>?style=flat-square" alt="License"></a>
</p>

<p align="center">
  Projeto de exemplo para testes de API REST em Node.js utilizando <strong>Pactum</strong>, <strong>Mocha</strong> e <strong>Chai</strong>.
</p>

---

## 📖 Sobre

Este repositório contém uma estrutura base para a automação de testes de API. O objetivo é demonstrar uma abordagem prática e eficiente para validar endpoints, utilizando um conjunto de ferramentas populares e poderosas do ecossistema JavaScript.

## ✨ Funcionalidades

-   **Testes de API:** Utiliza o [Pactum](https://pactumjs.github.io/) para criar requisições e asserções de forma declarativa e fluente.
-   **Test Runner:** Orquestra a execução dos testes com o [Mocha](https://mochajs.org/), um framework de testes flexível.
-   **Variáveis de Ambiente:** Gerencia configurações sensíveis (como URLs de API e chaves) de forma segura com o [Dotenv](https://github.com/motdotla/dotenv).
-   **Exemplos Práticos:** Inclui exemplos de testes para requisições `GET` e `POST`.

## 🚀 Começando

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

-   Node.js (versão 12 ou superior)
-   NPM ou Yarn

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/<SEU_USUARIO>/<SEU_REPOSITORIO>.git
    cd <SEU_REPOSITORIO>
    ```

2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

## ⚙️ Configuração

Este projeto utiliza a biblioteca `dotenv` para carregar variáveis de ambiente a partir de um arquivo `.env`.

1.  Crie um arquivo chamado `.env` na raiz do projeto.
2.  Adicione as variáveis necessárias para o seu ambiente de teste.

```bash
# .env
API_BASE_URL="https://api.seu-servico.com"
API_KEY="sua-chave-secreta-aqui"
```

## 🧪 Rodando os Testes

Para rodar a suíte de testes, execute o seguinte comando:

```bash
npm test
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Se você deseja contribuir, por favor, leia o `CONTRIBUTING.md` para mais detalhes sobre nosso código de conduta e o processo para submeter pull requests.

## 📜 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.