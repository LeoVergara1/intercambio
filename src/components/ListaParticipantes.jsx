import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ref, onValue } from 'firebase/database'
import { database } from '../firebase'
import './ListaParticipantes.css'

function ListaParticipantes() {
  const [participantes, setParticipantes] = useState([])
  const [configuracion, setConfiguracion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const participantesRef = ref(database, 'participantes')
    const configRef = ref(database, 'configuracion')
    
    const unsubscribeParticipantes = onValue(participantesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const lista = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        setParticipantes(lista)
      } else {
        setParticipantes([])
      }
      setCargando(false)
    })

    const unsubscribeConfig = onValue(configRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setConfiguracion(data)
      }
    })

    return () => {
      unsubscribeParticipantes()
      unsubscribeConfig()
    }
  }, [])

  if (cargando) {
    return (
      <div className="app">
        <header className="header">
          <h1>🎁 Intercambio de Regalos</h1>
        </header>
        <main className="main-content">
          <div className="mensaje-vacio">
            <p>⏳ Cargando participantes...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎁 Intercambio de Regalos</h1>
      </header>

      <main className="main-content">
        {configuracion && (
          <div className="config-banner">
            {configuracion.mensaje && (
              <p className="config-mensaje">
                <span className="emoji">🎉</span>
                {configuracion.mensaje}
              </p>
            )}
            <div className="config-detalles">
              {configuracion.presupuesto && (
                <div className="config-item">
                  <strong>💰 Presupuesto:</strong> {configuracion.presupuesto}
                </div>
              )}
              {configuracion.fecha && (
                <div className="config-item">
                  <strong>📅 Fecha:</strong> {new Date(configuracion.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    timeZone: 'UTC'
                  })}
                </div>
              )}
              {configuracion.lugar && (
                <div className="config-item">
                  <strong>📍 Lugar:</strong> 
                  {configuracion.mapaUrl ? (
                    <a 
                      href={configuracion.mapaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="lugar-link"
                    >
                      {configuracion.lugar} 🗺️
                    </a>
                  ) : (
                    <span> {configuracion.lugar}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="participantes-grid">
          {participantes.map((participante) => (
            <div key={participante.id} className="tarjeta-participante">
              <div className="tarjeta-header">
                <h3>{participante.nombre}</h3>
                <Link 
                  to={`/editar/${participante.id}`}
                  className="btn-editar"
                  title="Editar participante"
                >
                  ✏️
                </Link>
              </div>
              
              <div className="tarjeta-contenido">
                <div className="seccion">
                  <h4>🎁 Opciones de regalo:</h4>
                  <ul>
                    {participante.opciones.map((opcion, index) => (
                      <li key={index}>
                        {opcion}
                        {participante.urls && participante.urls[index] && (
                          <a 
                            href={participante.urls[index]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="url-link"
                          >
                            🔗 Ver
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="seccion">
                  <h4>❤️ Intereses:</h4>
                  <p>{participante.intereses}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {participantes.length === 0 && (
          <div className="mensaje-vacio">
            <p>No hay participantes aún. ¡Agrega el primero!</p>
          </div>
        )}
      </main>

      <Link to="/acciones" className="btn-flotante" title="Menú de acciones">
        ⚡
      </Link>
    </div>
  )
}

export default ListaParticipantes
