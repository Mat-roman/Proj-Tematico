export default function CampoTexto({ rotulo, dica, ...props }) {
  return (
    <label className="campo">
      <span className="campo-rotulo">{rotulo}</span>
      <input className="campo-input" {...props} />
      {dica && <span className="campo-dica">{dica}</span>}
    </label>
  )
}
