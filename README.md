# Projeto de Testes de API com PactumJS

<!-- Badges -->
<p align="center">
  <a href="https://www.npmjs.com/package/pactum"><img src="https://img.shields.io/npm/v/pactum.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://github.com/actions/workflows/ci.yml/badge.svg"><img src="https://github.com/actions/workflows/ci.yml/badge.svg" alt="Build Status"></a>
  <a href="https://github.com/blob/main/LICENSE"><img src="https://img.shields.io/github/license/?style=flat-square" alt="License"></a>
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
-   **Asserções:** Utiliza o [Chai](https://www.chaijs.com/) para asserções expressivas e legíveis.
-   **Variáveis de Ambiente:** Gerencia configurações sensíveis (como URLs de API e chaves) de forma segura com o [Dotenv](https://github.com/motdotla/dotenv).
-   **Estrutura Organizada:** Separação clara entre testes, helpers e configurações.
-   **CI/CD:** Integração com GitHub Actions para execução automática de testes.

## 📁 Estrutura do Projeto

```
PactumJS/
├── .github/
│   └── workflows/
│       └── ci.yml              # Configuração do GitHub Actions
├── helpers/
│   ├── dataFactories.js        # Fábricas de dados para testes
│   └── petHelpers.js           # Helpers específicos para testes de pets
├── setup/
│   └── base.js                 # Configurações base para os testes
├── test/
│   └── pet.spec.js             # Testes de API para endpoints de pets
├── .gitignore                  # Arquivos ignorados pelo Git
├── package.json                # Dependências e scripts do projeto
└── README.md                   # Este arquivo
```

## 🚀 Começando

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

-   Node.js (versão 12 ou superior)
-   NPM ou Yarn

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/gabrielelizio/PactumJS.git
    cd PactumJS
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

### Verificar saúde da API
```bash
npm run test:health
```

### Executar todos os testes
```bash
npm test
```

### Executar testes específicos
```bash
# Executar apenas testes de pets
npx mocha --require dotenv/config test/pet.spec.js

# Executar apenas health check
npm run test:health
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes específicos em modo watch
```bash
npm run test:watch:pet
```

## ⚠️ Solução de Problemas

### API retornando erro 500
Se a API do Petstore estiver retornando erro 500, isso pode ser um problema temporário. Os testes foram configurados para:

1. **Tratar erros graciosamente** - Os testes pulam automaticamente se não conseguirem criar pets
2. **Logs informativos** - Mensagens claras sobre o que está acontecendo
3. **Health check** - Use `npm run test:health` para verificar se a API está funcionando

### Testes falhando por dados incorretos
Os dados esperados foram ajustados para corresponder aos dados reais da API. Se ainda houver problemas:

1. Execute o health check primeiro
2. Verifique se a API está retornando os dados esperados
3. Ajuste os dados esperados nos testes conforme necessário

## 📦 Dependências Principais

- **pactum**: Framework para testes de API
- **mocha**: Test runner
- **chai**: Biblioteca de asserções
- **dotenv**: Gerenciamento de variáveis de ambiente

## 🔧 Scripts Disponíveis

- `npm test`: Executa todos os testes do projeto
- O script utiliza Mocha com configuração do dotenv e recursividade para encontrar todos os arquivos `.spec.js`

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Se você deseja contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma issue no repositório.