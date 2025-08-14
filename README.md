# Desafio API Node.js

Um desafio para principiantes que reúne boas práticas de desenvolvimento de APIs.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Fastify
- PostgreSQL 17
- Drizzle ORM
- Zod (validação)
- Docker & Docker Compose

## Pré-requisitos

- Node.js
- Docker e Docker Compose
- npm ou yarn

## Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/talvanes/desafio-api-nodejs.git
cd desafio-api-nodejs
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados

O projeto utiliza PostgreSQL 17 em um container Docker. Para iniciar o banco de dados:

```bash
docker compose up -d
```

Configurações do PostgreSQL:
- Host: localhost
- Porta: 5432
- Usuário: postgres
- Senha: postgres
- Banco de dados: apidb

### 4. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/apidb
```

## Estrutura do Projeto

```
├── src/
│   ├── database/
│   │   ├── client.ts    # Configuração do cliente do banco de dados
│   │   └── schema.ts    # Schema do banco de dados usando Drizzle ORM
│   └── routes/
│       ├── create-course.ts
│       ├── delete-course.ts
│       ├── get-course-by-id.ts
│       ├── get-courses.ts
│       ├── update-course-description.ts
│       └── update-course-title.ts
├── docker-compose.yaml
├── package.json
├── server.ts
├── tsconfig.json
└── requests.rest        # Arquivo com exemplos de requisições HTTP
```

## Scripts Disponíveis

```bash
# Desenvolvimento com hot-reload
npm run dev

# Gerenciar banco de dados
npm run db:generate     # Gerar migrações
npm run db:migrate      # Executar migrações
npm run db:studio      # Abrir Drizzle Studio
```

## API Endpoints

### Cursos

- `GET /courses` - Lista todos os cursos
- `GET /courses/:id` - Obtém um curso específico
- `POST /courses` - Cria um novo curso

### Documentação da API

Em ambiente de desenvolvimento, a documentação da API está disponível em:

- Swagger UI: `/swagger`
- Scalar API Reference: `/docs`

## Configurações Técnicas

### TypeScript

O projeto utiliza TypeScript com as seguintes configurações principais definidas no `tsconfig.json`:
- Módulos ES
- Tipos estritos
- Suporte a decoradores

### Fastify

O servidor Fastify está configurado com:
- Logging usando pino-pretty
- Validação e serialização com Zod
- Documentação OpenAPI (Swagger)
- Scalar API Reference para documentação interativa

### Docker

O ambiente de desenvolvimento utiliza Docker Compose com PostgreSQL 17:
- Container com nome `postgres17`
- Volume persistente para dados
- Configurações de reinício automático
- Portas e credenciais padrão para desenvolvimento

## Fluxo da Aplicação

```mermaid
graph TD
    A[Cliente] -->|GET /courses| B[Fastify Server]
    A -->|GET /courses/:id| B
    A -->|POST /courses| B
    
    B -->|Validação Zod| C{Validação OK?}
    C -->|Não| D[Retorna Erro]
    C -->|Sim| E[Drizzle ORM]
    
    E -->|Query| F[(PostgreSQL)]
    F -->|Dados| E
    E -->|Resultado| B
    B -->|Response JSON| A

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style F fill:#bfb,stroke:#333,stroke-width:2px
