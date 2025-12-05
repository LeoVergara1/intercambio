import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, onValue, set } from 'firebase/database'
import { database } from '../firebase'
import './Configuracion.css'

function Configuracion() {
  const navigate = useNavigate()
  const [configuracion, setConfiguracion] = useState({
    presupuesto: '',
    mensaje: '',
    fecha: '',
    lugar: '',
    mapaUrl: ''
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const configRef = ref(database, 'configuracion')
    
    const unsubscribe = onValue(configRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setConfiguracion(data)
      }
      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setConfiguracion(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const guardarConfiguracion = async (e) => {
    e.preventDefault()
    
    const configRef = ref(database, 'configuracion')
    await set(configRef, configuracion)
    
    alert('✅ Configuración guardada exitosamente')
    navigate('/')
  }

  if (cargando) {
    return (
      <div className="app">
        <header className="header">
          <h1>⚙️ Configuración del Intercambio</h1>
        </header>
        <main className="main-content">
          <div className="mensaje-vacio">
            <p>⏳ Cargando configuración...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>⚙️ Configuración del Intercambio</h1>
        <p>Define los detalles generales del evento</p>
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

        <form className="formulario" onSubmit={guardarConfiguracion}>
          <h2>Configuración General</h2>
          
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje de bienvenida</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={configuracion.mensaje}
              onChange={handleInputChange}
              placeholder="Ej: ¡Bienvenidos al intercambio navideño 2025! 🎄"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="presupuesto">Presupuesto sugerido</label>
            <input
              type="text"
              id="presupuesto"
              name="presupuesto"
              value={configuracion.presupuesto}
              onChange={handleInputChange}
              placeholder="Ej: $20-30"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha del intercambio</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={configuracion.fecha}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lugar">Lugar del intercambio</label>
            <input
              type="text"
              id="lugar"
              name="lugar"
              value={configuracion.lugar}
              onChange={handleInputChange}
              placeholder="Ej: Casa de María, Calle Principal #123"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mapaUrl">URL de Google Maps</label>
            <input
              type="url"
              id="mapaUrl"
              name="mapaUrl"
              value={configuracion.mapaUrl}
              onChange={handleInputChange}
              placeholder="Ej: https://maps.app.goo.gl/xxxxx"
            />
            <small style={{color: '#666', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>
              📍 Pega el enlace de Google Maps para que los participantes puedan ubicar el lugar
            </small>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              Guardar Configuración
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

export default Configuracion
