import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push, set } from 'firebase/database'
import { database } from '../firebase'
import './AgregarParticipante.css'

function AgregarParticipante() {
  const navigate = useNavigate()
  const [nuevoParticipante, setNuevoParticipante] = useState({
    nombre: '',
    opciones: '',
    urls: '',
    intereses: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoParticipante(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const agregarParticipante = async (e) => {
    e.preventDefault()
    
    if (!nuevoParticipante.nombre || !nuevoParticipante.opciones) {
      alert('Por favor completa al menos el nombre y las opciones')
      return
    }

    const participantesRef = ref(database, 'participantes')
    const nuevoRef = push(participantesRef)

    const nuevo = {
      nombre: nuevoParticipante.nombre,
      opciones: nuevoParticipante.opciones.split(',').map(o => o.trim()),
      urls: nuevoParticipante.urls ? nuevoParticipante.urls.split(',').map(u => u.trim()) : [],
      intereses: nuevoParticipante.intereses || 'No especificado',
      fechaCreacion: new Date().toISOString()
    }

    await set(nuevoRef, nuevo)

    // Redirigir a la lista
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
              value={nuevoParticipante.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Pedro López"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="opciones">Opciones de regalo (separadas por coma) *</label>
            <input
              type="text"
              id="opciones"
              name="opciones"
              value={nuevoParticipante.opciones}
              onChange={handleInputChange}
              placeholder="Ej: Libro, Taza, Reloj"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="urls">URLs de las opciones (separadas por coma, opcional)</label>
            <input
              type="text"
              id="urls"
              name="urls"
              value={nuevoParticipante.urls}
              onChange={handleInputChange}
              placeholder="Ej: https://amazon.com/libro, https://tienda.com/taza"
            />
            <small style={{color: '#666', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>
              💡 Ingresa las URLs en el mismo orden que las opciones
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="intereses">Intereses</label>
            <input
              type="text"
              id="intereses"
              name="intereses"
              value={nuevoParticipante.intereses}
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
