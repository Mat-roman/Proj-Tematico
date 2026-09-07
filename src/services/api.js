const URL_SIDECAR = 'http://127.0.0.1:5174'

/** Manda os dados para o sidecar e devolve o usuario, ou lanca o erro que ele responder. */
async function chamar(caminho, dados) {
  let resposta
  try {
    resposta = await fetch(URL_SIDECAR + caminho, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
  } catch {
    throw new Error('Sidecar inalcançavel')
  }

  const corpo = await resposta.json()
  if (!resposta.ok) throw new Error(corpo.erro)
  return corpo.usuario
}

export const login = (dados) => chamar('/auth/login', dados)
export const registrar = (dados) => chamar('/auth/registrar', dados)
