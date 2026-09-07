export default function Home({ usuario, aoSair }) {
  return (
    <main className="home">
      <h1>Ola, {usuario.nome}!</h1>
      <p>Login funcionando. A lista de tarefas entra na proxima etapa.</p>
      <button className="botao" onClick={aoSair}>Sair</button>
    </main>
  )
}
