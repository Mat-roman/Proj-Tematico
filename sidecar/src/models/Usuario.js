import { db } from '../db/database.js'

export function criar(nome, email, senhaHash) {
  db.prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome, email, senhaHash)
  return buscarPorEmail(email)
}

export function buscarPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)
}

/** Tira o hash da senha antes do usuario sair daqui. */
export function semSenha(usuario) {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email }
}
