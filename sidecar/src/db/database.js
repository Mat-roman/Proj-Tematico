import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data')
mkdirSync(pasta, { recursive: true })

export const db = new DatabaseSync(join(pasta, 'app.db'))

/** Cria as tabelas se ainda nao existirem. */
export function migrar() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tarefas (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      titulo     TEXT NOT NULL,
      concluida  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS micro_passos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      tarefa_id INTEGER NOT NULL,
      descricao TEXT NOT NULL,
      ordem     INTEGER NOT NULL,
      concluido INTEGER NOT NULL DEFAULT 0
    );
  `)
}
