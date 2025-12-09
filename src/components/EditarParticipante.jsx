import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ref, get, set } from 'firebase/database'
import { database } from '../firebase'
import './EditarParticipante.css'

function EditarParticipante() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [nombre, setNombre] = useState('')
  const [intereses, setIntereses] = useState('')
  const [opciones, setOpciones] = useState([])
  const [proximoId, setProximoId] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [fechaCreacion, setFechaCreacion] = useState('')

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    const cargarParticipante = async () => {
      const participanteRef = ref(database, `participantes/${id}`)
      const snapshot = await get(participanteRef)
      
      if (snapshot.exists()) {
        const data = snapshot.val()
        setNombre(data.nombre)
        setIntereses(data.intereses || '')
        setFechaCreacion(data.fechaCreacion || new Date().toISOString())
        
        const opcionesFormatted = data.opciones.map((opcion, index) => ({
          id: index + 1,
          nombre: opcion,
          url: data.urls && data.urls[index] ? data.urls[index] : ''
        }))
        setOpciones(opcionesFormatted)
        setProximoId(opcionesFormatted.length + 1)
        setCargando(false)
      } else {
        navigate('/')
      }
    }

    cargarParticipante()
  }, [id, navigate])

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

  const guardarCambios = async (e) => {
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

    const participanteRef = ref(database, `participantes/${id}`)
    
    const actualizado = {
      nombre: nombre.trim(),
      opciones: opcionesValidas.map(op => op.nombre.trim()),
      urls: opcionesValidas.map(op => op.url.trim()).filter(url => url !== ''),
      intereses: intereses.trim() || 'No especificado',
      fechaCreacion: fechaCreacion
    }

    await set(participanteRef, actualizado)
    
    navigate('/')
  }

  if (cargando) {
    return (
      <div className="app">
        <header className="header">
          <h1>✏️ Editar Participante</h1>
        </header>
        <main className="main-content">
          <div className="mensaje-vacio">
            <p>⏳ Cargando...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>✏️ Editar Participante</h1>
        <p>Modifica la información de {nombre}</p>
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

        <form className="formulario" onSubmit={guardarCambios}>
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
              Guardar Cambios
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

export default EditarParticipante
