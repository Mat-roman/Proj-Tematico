# Organizador de Tarefas com Quebra Inteligente

Aplicativo desktop que ajuda pessoas com sobrecarga cognitiva a quebrar tarefas complexas em micro-passos, usando IA para gerar a decomposição.

## Sobre o projeto

Projeto desenvolvido para a disciplina **Projeto Temático II** (UCS) pelo Grupo 9.

**Integrantes:**
- Mateus
- Nathália (front-end)
- Guilherme
- Saymon

## Stack tecnológica

- **Tauri** (núcleo em Rust) — empacotamento do app desktop, janela nativa, IPC e sistema de arquivos
- **React/Vue** — interface do usuário (WebView do Tauri)
- **Node.js (sidecar)** — lógica de negócio e orquestração da IA
- **LangChain** — orquestração dos prompts enviados à IA
- **API Gemini** — geração da decomposição da tarefa em micro-passos
- **SQLite** — persistência de tarefas, micro-passos e preferências

## Arquitetura

Organizada em MVC: o Tauri (Rust) atua como Controller nativo, repassando as chamadas a um processo sidecar em Node.js, onde ficam concentradas as regras de negócio (Model/Service), a comunicação com a IA e o acesso ao banco de dados.

```

<img width="2720" height="2272" alt="fluxo_decompor_tarefa_tauri" src="https://github.com/user-attachments/assets/1af8e5ef-db78-4a58-9e2f-fd9174e8f916" />

```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (via rustup)
- [Tauri CLI](https://tauri.app/start/prerequisites/) e as dependências de sistema do seu SO (WebView2 no Windows, WebKitGTK no Linux, etc.)
- Uma chave de API do [Google AI Studio (Gemini)](https://aistudio.google.com/)

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd organizador-de-tarefas

# Instalar dependências do front-end
npm install

# Instalar dependências do sidecar Node.js
cd sidecar
npm install
cd ..
```

## Configuração

Crie um arquivo `.env` dentro de `sidecar/` com sua chave da API:

```
GEMINI_API_KEY=sua_chave_aqui
```

> Nunca commite o arquivo `.env` — ele já deve estar listado no `.gitignore`.

## Rodando em desenvolvimento

```bash
npm run tauri dev
```

Isso sobe a interface (WebView), inicia o sidecar Node.js e abre a janela do aplicativo.

## Build de produção

```bash
npm run tauri build
```

O instalador/executável gerado fica em `src-tauri/target/release/bundle/`.

## Estrutura do projeto

```
├── src/                 # Interface (React/Vue) — View
├── src-tauri/            # Núcleo Tauri em Rust — Controller
│   ├── src/
│   └── tauri.conf.json
├── sidecar/              # Processo Node.js — Model/Service
│   ├── src/
│   │   ├── services/     # Orquestração da IA (LangChain)
│   │   └── db/           # Acesso ao SQLite
│   └── package.json
└── README.md
```

## Funcionalidades principais

- Criar tarefa e decompor em micro-passos via IA
- Marcar micro-passos como concluídos
- Editar micro-passos gerados pela IA
- Exportar/importar tarefas (arquivo local)
- Configurar preferências (granularidade dos micro-passos, notificações)

## Status

Versão inicial — arquitetura em desenvolvimento. Documento de arquitetura MVC disponível em `/docs`.
