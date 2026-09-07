import { useState } from 'react'
import CampoTexto from '../components/CampoTexto.jsx'
import * as api from '../services/api.js'

export default function Login({ aoEntrar }) {
  const [criandoConta, setCriandoConta] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function trocarModo() {
    setCriandoConta(!criandoConta)
    setNome('')
    setEmail('')
    setSenha('')
    setErro('')
  }

  async function enviar(evento) {
    evento.preventDefault()
    setEnviando(true)
    setErro('')

    try {
      const usuario = criandoConta
        ? await api.registrar({ nome, email, senha })
        : await api.login({ email, senha })
      aoEntrar(usuario)
    } catch (falha) {
      setErro(falha.message)
    }

    setEnviando(false)
  }

  return (
    <main className="login">
      <form className="login-cartao" onSubmit={enviar}>
        <h1 className="login-titulo">Organizador de Tarefas</h1>
        <p className="login-subtitulo">
          {criandoConta ? 'Crie sua conta para comecar.' : 'Entre para ver suas tarefas.'}
        </p>

        {erro && <p className="login-erro">{erro}</p>}

        {criandoConta && (
          <CampoTexto
            rotulo="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        )}

        <CampoTexto
          rotulo="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CampoTexto
          rotulo="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          dica={criandoConta ? 'Pelo menos 6 caracteres.' : ''}
        />

        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Aguarde...' : criandoConta ? 'Criar conta' : 'Entrar'}
        </button>

        <p className="login-alternar">
          {criandoConta ? 'Ja tem uma conta?' : 'Ainda nao tem conta?'}{' '}
          <button className="login-link" type="button" onClick={trocarModo}>
            {criandoConta ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
      </form>
    </main>
  )
}
