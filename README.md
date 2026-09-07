# Organizador de Tarefas com Quebra Inteligente

Aplicativo desktop que ajuda pessoas com sobrecarga cognitiva a quebrar tarefas complexas em micro-passos, usando IA para gerar a decomposição.

Projeto da disciplina **Projeto Temático II** (UCS) — Grupo 9: Mateus, Nathália, Guilherme e Saymon.

## Antes de começar

> ⚠️ **Comece pela branch [`ambiente`](../../tree/ambiente).**
> Ela tem o guia de instalação do Node, Rust e das dependências de sistema do Tauri.
> Sem esse passo o projeto não compila.

```bash
git checkout ambiente
```

Leia o README de lá, deixe a máquina pronta, e só então volte pra `master`.

## Fluxo de trabalho

**Ninguém commita direto na `master`.** Ela só recebe código via pull request aprovado.

1. Crie uma branch a partir da `master`:
   ```bash
   git checkout master && git pull
   git checkout -b feat/nome-da-tarefa
   ```
2. Desenvolva e commite normalmente nela.
3. Suba a branch e abra um **pull request** para a `master`.
4. Peça revisão pra outro integrante do grupo. **É preciso pelo menos 1 aprovação** para o merge.
5. Depois do merge, apague a branch.

Nomes de branch: `feat/` para funcionalidade nova, `fix/` para correção, `docs/` para documentação.

## Stack

- **Tauri** (Rust) — janela nativa, IPC e sistema de arquivos
- **React/Vue** — interface (WebView do Tauri)
- **Node.js (sidecar)** — regras de negócio e orquestração da IA
- **LangChain** — orquestração dos prompts
- **API Gemini** — geração dos micro-passos
- **SQLite** — persistência de tarefas, micro-passos e preferências

## Arquitetura

O projeto segue **MVC**. O Tauri fica de fora das camadas: ele só empacota o app
e abre a janela — nada de regra de negócio é escrito em Rust.

```
        VIEW                    CONTROLLER            MODEL
   src/ (React)  ── HTTP ──►  sidecar/server.js  ──►  services/ + models/ + db/
                                  (rotas)                  │
                                                           ▼
                                                    SQLite · Gemini
```

A View nunca fala com o banco nem com a IA direto — tudo passa pelas rotas do sidecar.

```
Proj-Tematico/
│
├── src/                    ◄── VIEW
│   ├── components/             Componentes de interface (React)
│   ├── pages/                  Telas do app
│   └── services/api.js         Único ponto que chama o sidecar
│
├── sidecar/                ◄── CONTROLLER + MODEL
│   ├── src/
│   │   ├── server.js           Controller: recebe a chamada e delega
│   │   ├── models/             Entidades (Usuario, Tarefa, MicroPasso)
│   │   ├── services/           Regras de negócio + IA (LangChain/Gemini)
│   │   └── db/                 Acesso ao SQLite
│   └── package.json
│
├── src-tauri/                  Núcleo nativo: janela e empacotamento.
│   ├── src/                    Boilerplate do Tauri — não escrevemos Rust aqui.
│   └── tauri.conf.json         Configuração da janela e do build
│
└── docs/                       Documento de arquitetura MVC completo
```

> As pastas `src/` e `src-tauri/` mantêm esses nomes porque são exigidos pelas
> ferramentas (Vite e CLI do Tauri) — renomear quebra o build.

## Rodando

As dependências ficam em dois lugares — a raiz (front-end) e `sidecar/`. Instale nos dois antes da primeira execução.

```bash
npm run tauri dev
```

Sobe a interface, inicia o sidecar e abre a janela. A primeira execução compila todo o Rust e demora.

Build de produção:

```bash
npm run tauri build
```

Saída em `src-tauri/target/release/bundle/`.

## Variáveis de ambiente

`sidecar/.env`, com a sua chave do [Google AI Studio](https://aistudio.google.com/):

```
GEMINI_API_KEY=sua_chave_aqui
```

Chave é individual e o `.env` não vai pro repositório.

## Funcionalidades

- Criar tarefa e decompor em micro-passos via IA
- Marcar micro-passos como concluídos
- Editar micro-passos gerados pela IA
- Exportar/importar tarefas (arquivo local)
- Configurar preferências (granularidade, notificações)

## Status

Versão inicial — arquitetura em desenvolvimento.
