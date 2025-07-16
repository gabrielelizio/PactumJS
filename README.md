# PactumJS - Testes Automatizados de API

Este projeto é uma base robusta para automação de testes de APIs REST utilizando [PactumJS](https://pactumjs.github.io/), [Mocha](https://mochajs.org/) e [Chai](https://www.chaijs.com/). Ele foi pensado para ser facilmente adaptável a qualquer API privada, com foco em boas práticas, clareza e manutenção.

---

## 📁 Estrutura do Projeto

```
PactumJS/
├── .github/                # Workflows de CI/CD (GitHub Actions)
│   └── workflows/
│       └── ci.yml          # Pipeline de testes automatizados
├── helpers/                # Funções auxiliares reutilizáveis
│   ├── dataFactories.js    # Fábricas de dados para os testes
│   ├── petHelpers.js       # Helpers para operações com pets
│   └── retryHelper.js      # Helper genérico para lógica de retry (DRY)
├── setup/                  # Configurações globais dos testes
│   └── base.js             # Setup de URL base, dotenv, etc.
├── test/                   # Testes automatizados
│   ├── health-check.spec.js# Teste de saúde da API
│   └── pet.spec.js         # Testes dos endpoints de pets
├── .env                    # Variáveis de ambiente (NÃO versionar)
├── .gitignore              # Arquivos/pastas ignorados pelo git
├── package.json            # Dependências e scripts do projeto
├── package-lock.json       # Lockfile do npm
├── README.md               # Documentação do projeto
```

---

## 🚀 Sobre o Projeto

- **Automação de testes de API REST** com PactumJS, Mocha e Chai.
- **DRY e robustez:** lógica de retry centralizada, tratamento de inconsistências eventuais, logs detalhados.
- **Fácil manutenção:** estrutura modular, helpers reutilizáveis, exemplos claros.
- **Pronto para CI/CD:** integração com GitHub Actions.

---

## ⚙️ Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
BASE_URL=https://sua-api-privada.com/api/v1
```
- Substitua pelo endpoint da sua API privada.
- **Nunca** faça commit do `.env`.

### 2. Instale as dependências

```sh
npm install
```

### 3. Como rodar os testes

```sh
npm test
```

---

## 🧪 Estrutura dos Testes

- **setup/base.js:** Carrega variáveis de ambiente e define a URL base para todas as requisições PactumJS.
- **helpers/retryHelper.js:** Função `retryAsync` para DRY de tentativas (usada em GET, PUT, DELETE, etc).
- **helpers/petHelpers.js:** Funções para criar, deletar e manipular pets.
- **test/pet.spec.js:** Testes completos dos endpoints de pet, usando retry, validação de schema e boas práticas.
- **test/health-check.spec.js:** Teste simples para verificar se a API está online.

---

## 🛡️ Segurança

- O projeto **NÃO** deve ser usado com APIs públicas sem autenticação.
- Sempre defina a variável `BASE_URL` para ambientes privados.
- O `.gitignore` já ignora `.env` por padrão.
- Em CI/CD, defina `BASE_URL` no workflow (exemplo para GitHub Actions):

```yaml
- name: Rodar testes
  run: npm test
  env:
    BASE_URL: https://sua-api-privada.com/api/v1
```

---

## 📦 Principais Dependências

- **pactum**: Framework para testes de API
- **mocha**: Test runner
- **chai**: Biblioteca de asserções
- **dotenv**: Gerenciamento de variáveis de ambiente

---

## 🏆 Boas Práticas Adotadas

- **DRY:** Retry centralizado em helper reutilizável.
- **Logs detalhados:** Facilita troubleshooting.
- **Testes resilientes:** Lida com delays e inconsistências da API.
- **Estrutura modular:** Fácil de expandir e manter.

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 🆘 Suporte

- Abra uma issue no repositório para dúvidas, bugs ou sugestões.

---

## 📜 Licença

Este projeto está licenciado sob a Licença ISC. Veja o arquivo LICENSE para mais detalhes.
