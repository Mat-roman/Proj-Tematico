import { createServer } from 'node:http'
import { migrar } from './db/database.js'
import { registrar, autenticar } from './services/authService.js'

const PORTA = 5174

const rotas = {
  'POST /auth/registrar': registrar,
  'POST /auth/login': autenticar,
}

/** Le o corpo da requisicao e devolve como objeto. */
async function lerCorpo(req) {
  let texto = ''
  for await (const parte of req) texto += parte
  return texto ? JSON.parse(texto) : {}
}

migrar()

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end()
    return
  }

  const rota = rotas[`${req.method} ${req.url}`]
  if (!rota) {
    res.writeHead(404).end(JSON.stringify({ erro: 'Rota nao encontrada.' }))
    return
  }

  try {
    const usuario = rota(await lerCorpo(req))
    res.writeHead(200).end(JSON.stringify({ usuario }))
  } catch (erro) {
    res.writeHead(400).end(JSON.stringify({ erro: erro.message }))
  }
}).listen(PORTA, '127.0.0.1', () => {
  console.log(`sidecar ouvindo em http://127.0.0.1:${PORTA}`)
})
