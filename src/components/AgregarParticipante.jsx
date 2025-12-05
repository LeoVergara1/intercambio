import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push, set } from 'firebase/database'
import { database } from '../firebase'
import './AgregarParticipante.css'

function AgregarParticipante() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [intereses, setIntereses] = useState('')
  const [opciones, setOpciones] = useState([
    { id: 1, nombre: '', url: '' },
  ])
  const [proximoId, setProximoId] = useState(2)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'nombre') {
      setNombre(value)
    } else if (name === 'intereses') {
      setIntereses(value)
    }
  }

  const actualizarOpcion = (id, campo, valor) => {
    setOpciones(opciones.map(op => 
      op.id === id ? { ...op, [campo]: valor } : op
    ))
  }

  const agregarOpcion = () => {
    setOpciones([...opciones, { id: proximoId, nombre: '', url: '' }])
    setProximoId(proximoId + 1)
  }

  const eliminarOpcion = (id) => {
    if (opciones.length > 1) {
      setOpciones(opciones.filter(op => op.id !== id))
    } else {
      alert('Debe haber al menos una opción de regalo')
    }
  }

  const agregarParticipante = async (e) => {
    e.preventDefault()
    
    if (!nombre.trim()) {
      alert('Por favor ingresa el nombre del participante')
      return
    }

    const opcionesValidas = opciones.filter(op => op.nombre.trim() !== '')
    if (opcionesValidas.length === 0) {
      alert('Por favor agrega al menos una opción de regalo')
      return
    }

    const participantesRef = ref(database, 'participantes')
    const nuevoRef = push(participantesRef)

    const nuevo = {
      nombre: nombre.trim(),
      opciones: opcionesValidas.map(op => op.nombre.trim()),
      urls: opcionesValidas.map(op => op.url.trim()).filter(url => url !== ''),
      intereses: intereses.trim() || 'No especificado',
      fechaCreacion: new Date().toISOString()
    }

    await set(nuevoRef, nuevo)

    setNombre('')
    setIntereses('')
    setOpciones([{ id: 1, nombre: '', url: '' }])
    setProximoId(2)
    
    navigate('/')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎁 Agregar Participante</h1>
        <p>Completa la información del nuevo participante</p>
      </header>

      <main className="main-content">
        <div className="actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            ← Volver a la lista
          </button>
        </div>

        <form className="formulario" onSubmit={agregarParticipante}>
          <h2>Datos del Participante</h2>
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={handleInputChange}
              placeholder="Ej: Pedro López"
              required
            />
          </div>

          <div className="form-group">
            <label>Opciones de regalo *</label>
            <div className="opciones-container">
              {opciones.map((opcion, index) => (
                <div key={opcion.id} className="opcion-item">
                  <div className="opcion-numero">{index + 1}</div>
                  <div className="opcion-inputs">
                    <input
                      type="text"
                      placeholder="Nombre del regalo"
                      value={opcion.nombre}
                      onChange={(e) => actualizarOpcion(opcion.id, 'nombre', e.target.value)}
                      className="input-opcion"
                    />
                    <input
                      type="url"
                      placeholder="URL (opcional)"
                      value={opcion.url}
                      onChange={(e) => actualizarOpcion(opcion.id, 'url', e.target.value)}
                      className="input-url"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarOpcion(opcion.id)}
                    className="btn-quitar"
                    disabled={opciones.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={agregarOpcion}
              className="btn-agregar-opcion"
            >
              + Agregar otra opción
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="intereses">Intereses</label>
            <input
              type="text"
              id="intereses"
              name="intereses"
              value={intereses}
              onChange={handleInputChange}
              placeholder="Ej: Deportes, lectura, música"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              Guardar Participante
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AgregarParticipante
