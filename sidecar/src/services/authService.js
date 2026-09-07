import { randomBytes, scryptSync } from 'node:crypto'
import * as Usuario from '../models/Usuario.js'

/** Transforma a senha em "salt:hash" para guardar no banco. */
function gerarHash(senha) {
  const salt = randomBytes(16).toString('hex')
  return salt + ':' + scryptSync(senha, salt, 64).toString('hex')
}

/** Confere a senha digitada contra o "salt:hash" guardado. */
function senhaConfere(senha, guardado) {
  const [salt, hash] = guardado.split(':')
  return scryptSync(senha, salt, 64).toString('hex') === hash
}

export function registrar({ nome, email, senha }) {
  nome = (nome ?? '').trim()
  email = (email ?? '').trim().toLowerCase()

  if (nome.length < 2) throw new Error('Informe seu nome.')
  if (!email.includes('@')) throw new Error('E-mail invalido.')
  if ((senha ?? '').length < 6) throw new Error('A senha precisa de pelo menos 6 caracteres.')
  if (Usuario.buscarPorEmail(email)) throw new Error('Ja existe uma conta com esse e-mail.')

  return Usuario.semSenha(Usuario.criar(nome, email, gerarHash(senha)))
}

export function autenticar({ email, senha }) {
  const usuario = Usuario.buscarPorEmail((email ?? '').trim().toLowerCase())

  if (!usuario || !senhaConfere(senha ?? '', usuario.senha_hash)) {
    throw new Error('E-mail ou senha incorretos.')
  }
  return Usuario.semSenha(usuario)
}
