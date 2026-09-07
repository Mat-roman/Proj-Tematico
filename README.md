# Organizador de Tarefas com Quebra Inteligente

Aplicativo desktop que ajuda pessoas com sobrecarga cognitiva a quebrar tarefas complexas em micro-passos, usando IA para gerar a decomposição.

> **Branch `ambiente`** — esta branch cuida da preparação do ambiente de desenvolvimento.
> Se você acabou de entrar no projeto, siga o passo a passo de [Configuração do ambiente](#configuração-do-ambiente) antes de qualquer outra coisa.

## Sobre o projeto

Projeto desenvolvido para a disciplina **Projeto Temático II** (UCS) pelo Grupo 9.

**Integrantes:**
- Mateus
- Nathália
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

O projeto segue **MVC**, e cada camada mora em uma pasta própria:

```
VIEW              CONTROLLER              MODEL
src/      ──────►  src-tauri/    ──────►  sidecar/  ──────►  SQLite
(React/Vue)        (Rust/Tauri)           (Node.js)          Gemini
```

A View nunca fala com o banco nem com a IA direto — tudo passa pelo Controller.
Detalhe de cada pasta em [Estrutura do projeto](#estrutura-do-projeto).

---

# Configuração do ambiente

> **Status atual:** o código do app ainda não foi criado — o repositório tem apenas este README.
> Ou seja, `npm install` e `npm run tauri dev` **ainda não funcionam**. O objetivo agora é deixar
> a máquina de cada um pronta para quando o scaffold for criado.

## O que instalar

Precisamos de **quatro** coisas: Node.js, Rust, o compilador C/C++ do sistema e uma chave da API Gemini.

### 1. Node.js 18 ou superior

Executa a interface (Vite/React) e o sidecar.

**Windows**
```bash
winget install --id OpenJS.NodeJS.LTS -e
```

**macOS**
```bash
brew install node
```

**Linux (Debian/Ubuntu)**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install -y nodejs
```

### 2. Rust (via rustup)

O núcleo do Tauri é escrito em Rust. Instale **sempre pelo rustup**, nunca por pacote da distro.

**Windows**
```bash
winget install --id Rustlang.Rustup -e
```

**macOS / Linux**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

> Feche e reabra o terminal depois de instalar, senão o `cargo` não aparece no PATH.

### 3. Dependências de sistema (compilador C/C++)

O Rust precisa de um linker nativo, e o Tauri precisa da engine de WebView do SO.

**Windows** — Microsoft C++ Build Tools:
```bash
winget install --id Microsoft.VisualStudio.2022.BuildTools -e
```
No instalador que abrir, marque a carga de trabalho **"Desktop development with C++"** e conclua.
O **WebView2** já vem instalado no Windows 10/11 — nada a fazer.

**macOS** — ferramentas de linha de comando do Xcode:
```bash
xcode-select --install
```

**Linux (Debian/Ubuntu)** — WebKitGTK e afins:
```bash
sudo apt update && sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### 4. Chave da API Gemini

Cada integrante gera a **sua própria** chave em https://aistudio.google.com/ (é gratuita).
Ela vai no arquivo `sidecar/.env`, descrito em [Variáveis de ambiente](#variáveis-de-ambiente).

**Nunca commite sua chave.** O `.env` deve estar no `.gitignore`.

## Verificando a instalação

Rode os quatro comandos abaixo. Todos precisam responder com uma versão:

```bash
node -v
npm -v
rustc --version
cargo --version
```

Saída esperada (as versões podem ser mais novas):

```
v18.0.0 ou superior
9.0.0 ou superior
rustc 1.7x.x
cargo 1.7x.x
```

Se `rustc` ou `cargo` derem "command not found", reabra o terminal. Se persistir, o rustup não
entrou no PATH — reinstale pelo passo 2.

## Editor recomendado

VS Code, com as extensões:

- **rust-analyzer** (`rust-lang.rust-analyzer`) — autocomplete e erros do Rust
- **Tauri** (`tauri-apps.tauri-vscode`) — suporte ao `tauri.conf.json`
- **ESLint** e **Prettier** — padronização do código do front-end e do sidecar

## Instalação do projeto

> Válido a partir do momento em que o scaffold do Tauri existir no repositório.

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd Proj-Tematico

# Instalar dependências do front-end
npm install

# Instalar dependências do sidecar Node.js
cd sidecar
npm install
cd ..
```

## Variáveis de ambiente

Crie um arquivo `.env` dentro de `sidecar/` com a sua chave:

```
GEMINI_API_KEY=sua_chave_aqui
```

> Nunca commite o arquivo `.env` — ele já deve estar listado no `.gitignore`.

## Rodando em desenvolvimento

```bash
npm run tauri dev
```

Isso sobe a interface (WebView), inicia o sidecar Node.js e abre a janela do aplicativo.

> A **primeira** execução compila todo o Rust e pode levar vários minutos. As seguintes são rápidas.

## Build de produção

```bash
npm run tauri build
```

O instalador/executável gerado fica em `src-tauri/target/release/bundle/`.

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| `rustc: command not found` | Terminal aberto antes da instalação | Feche e reabra o terminal |
| `link.exe not found` (Windows) | Build Tools sem a carga C++ | Reabra o instalador e marque "Desktop development with C++" |
| `error: linker cc not found` (Linux) | Falta `build-essential` | Rode o `apt install` do passo 3 |
| `GEMINI_API_KEY is not defined` | `.env` ausente ou fora de `sidecar/` | Confira o caminho do arquivo `.env` |
| Build muito lenta na 1ª vez | Compilação inicial do Rust | Normal — aguarde |

---

## Estrutura do projeto

```
Proj-Tematico/
│
├── src/                    ◄── VIEW
│   ├── components/             Componentes de interface (React/Vue)
│   └── pages/                  Telas do app
│
├── src-tauri/              ◄── CONTROLLER
│   ├── src/                    Núcleo Rust: recebe as ações da View,
│   │                           repassa ao sidecar e devolve a resposta
│   └── tauri.conf.json         Configuração da janela e permissões
│
├── sidecar/                ◄── MODEL
│   ├── src/
│   │   ├── models/             Entidades (Tarefa, MicroPasso, Preferência)
│   │   ├── services/           Regras de negócio + IA (LangChain/Gemini)
│   │   └── db/                 Acesso ao SQLite
│   ├── .env                    Sua GEMINI_API_KEY (não versionado)
│   └── package.json
│
└── docs/                       Documento de arquitetura MVC completo
```

> As pastas `src/` e `src-tauri/` mantêm esses nomes porque são exigidos pelas
> ferramentas (Vite e CLI do Tauri) — renomear quebra o build. A camada MVC de
> cada uma está marcada acima.

## Funcionalidades principais

- Criar tarefa e decompor em micro-passos via IA
- Marcar micro-passos como concluídos
- Editar micro-passos gerados pela IA
- Exportar/importar tarefas (arquivo local)
- Configurar preferências (granularidade dos micro-passos, notificações)

## Status

Versão inicial — arquitetura em desenvolvimento. Documento de arquitetura MVC disponível em `/docs`.
