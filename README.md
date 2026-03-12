# Auth API – Clean Architecture

API de autenticação desenvolvida em Node.js com TypeScript, seguindo princípios de Clean Architecture e Clean Code.

## Tecnologias
- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Docker

## Arquitetura
O projeto segue Clean Architecture, separando domínio, aplicação, infraestrutura e camada de entrada (HTTP).

## Como rodar o projeto

```bash
npm install

# Para testes em memória (sem banco):
npm test

# Para rodar com PostgreSQL
1. instale o Docker Desktop (https://www.docker.com/products/docker-desktop)
2. inicie o serviço:
   ```bash
   docker-compose up -d
   ```
3. copie `.env.example` para `.env` e ajuste variáveis se necessário
4. execute a aplicação normalmente:
   ```bash
   npm run dev
   ```

# Rodar testes de integração com banco real
```bash
POSTGRES_URL=postgresql://postgres:postgres@localhost:5433/auth_db npm test
```
