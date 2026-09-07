import { useState } from 'react'
import Login from './pages/Login.jsx'

export default function App() {
  const [usuario, setUsuario] = useState(null)

  return usuario
    ? <Home usuario={usuario} aoSair={() => setUsuario(null)} />
    : <Login aoEntrar={setUsuario} />
}
