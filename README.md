🧩 TODO – Frontend (Angular)

Frontend da aplicação TODO, desenvolvido em Angular 18 (Standalone) com Angular Material v3, consumindo a API do backend com autenticação via JWT e interface moderna (Tasks + Dashboard).

✨ Features

✅ Login e Cadastro (JWT)

✅ Proteção de rotas (Auth Guard)

✅ CRUD de Tasks (criar, editar, deletar)

✅ Filtro por status (PENDING / IN_PROGRESS / DONE)

✅ Contador de tarefas no header

✅ Transições / animações leves (UX)

✅ Dashboard (/dashboard) pronto para gráficos (amCharts)

🧱 Arquitetura (alto nível)

Estrutura baseada em features + shared + auth, com Standalone Components:

src/app
├── auth
│   ├── pages                # login/register pages
│   ├── guard                # route guard
│   ├── interceptors         # JWT injection
│   └── storage              # token storage
│
├── features
│   ├── tasks
│   │   ├── pages
│   │   ├── components
│   │   ├── dialogs
│   │   ├── data             # API layer (TaskApi)
│   │   └── models
│   └── dashboard
│       └── pages
│
├── shared
│   └── ui                   # confirm dialog, helpers, etc
│
├── app.routes.ts
├── app.config.ts
└── app.component.*

🎯 Objetivo dessa organização

Separar responsabilidades por domínio/feature

Facilitar escalabilidade

Reutilização via shared

Menos acoplamento e mais clareza

🚀 Stack Tecnológica
Core

Angular 18 (Standalone)

TypeScript

RxJS

UI

Angular Material v3

Material Icons

Layout responsivo (mobile 1 coluna, desktop com grid)

HTTP / Auth

HttpClient

JWT Interceptor

Auth Guard

Token persistido em localStorage (via TokenStorage)

Infra (Deploy)

Docker (multi-stage build)

Nginx (servindo SPA + proxy /api para o backend)

CI/CD com GitHub Actions

Deploy em AWS EC2 via SSM (mesma estratégia do backend)

🔐 Autenticação (JWT)

Após login, o backend retorna um token JWT.

O frontend:

salva o token (TokenStorage)

injeta automaticamente em requests /api/* (exceto /api/auth/*) via interceptor:

Authorization: Bearer <token>


Rotas protegidas (ex.: /tasks, /dashboard) exigem usuário autenticado.

▶️ Como rodar local
1️⃣ Pré-requisitos

Node.js 20+

NPM

Angular CLI (opcional, mas recomendado)

2️⃣ Instalar dependências

Na raiz do projeto:

npm install

3️⃣ Rodar em modo dev
npm start


Por padrão roda em:

http://localhost:4200


O script já pode usar proxy via proxy.conf.json se configurado.

🔧 Configurando o proxy (DEV)

Para o Angular dev server encaminhar /api pro backend local:

proxy.conf.json

{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}


Assim o frontend chama:

/api/tasks

/api/auth/login

/api/auth/register

sem CORS e sem precisar hardcodear URL.

🐳 Rodando via Docker (produção)

O projeto possui Dockerfile com build do Angular e runtime via Nginx:

Build da imagem
docker build -t stefanini-todo-front .

Rodar container
docker run -p 80:80 stefanini-todo-front


A aplicação ficará em:

http://localhost

🌐 Nginx e Proxy /api

No ambiente de produção (EC2), o Nginx do frontend faz proxy:

/ → SPA Angular

/api/* → backend (stefanini-backend:8080)

Isso permite acessar tudo pela mesma origem (sem CORS):

http://<EC2_PUBLIC_IP>/

📦 CI/CD

O pipeline (GitHub Actions) realiza:

npm ci

npm run build

build e push da imagem no DockerHub

deploy no EC2 apenas na branch main (via SSM)

✅ Rotas

/login

/register

/tasks (protegida)

/dashboard (protegida)

🧪 Testes manuais recomendados

Cadastro → Login → Criar tarefa → Atualizar status → Deletar

Validar que tasks são do usuário logado

Trocar de usuário e confirmar isolamento dos dados

Dashboard renderizando e consumindo dados (próximo passo)

🤖 Uso de IA no projeto

A IA foi utilizada como:

copiloto para estrutura de projeto

sugestões de UI/UX

organização por features

suporte na configuração do Docker/Nginx

orientação para boas práticas com Angular 18 Standalone

Decisões e implementação final foram realizadas com validação humana.

👨‍💻 Autor

Rodrigo Ferraz
Projeto desenvolvido com foco em arquitetura, qualidade e experiência do usuário.
