import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, onValue, remove } from 'firebase/database'
import { database } from '../firebase'
import './Administrar.css'

function Administrar() {
  const navigate = useNavigate()
  const [participantes, setParticipantes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const participantesRef = ref(database, 'participantes')
    
    const unsubscribe = onValue(participantesRef, (snapshot) => {
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

    return () => unsubscribe()
  }, [])

  const eliminarParticipante = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      const participanteRef = ref(database, `participantes/${id}`)
      await remove(participanteRef)
    }
  }

  if (cargando) {
    return (
      <div className="app">
        <header className="header">
          <h1>🔧 Administrar Participantes</h1>
          <p>Gestiona y elimina participantes</p>
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
        <h1>🔧 Administrar Participantes</h1>
        <p>Gestiona y elimina participantes del intercambio</p>
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

        <div className="admin-table-container">
          {participantes.length === 0 ? (
            <div className="mensaje-vacio">
              <p>No hay participantes registrados</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Opciones</th>
                  <th>Intereses</th>
                  <th>Fecha de registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {participantes.map((participante) => (
                  <tr key={participante.id}>
                    <td className="nombre-cell">
                      <strong>{participante.nombre}</strong>
                    </td>
                    <td className="opciones-cell">
                      {participante.opciones.join(', ')}
                    </td>
                    <td>{participante.intereses}</td>
                    <td className="fecha-cell">
                      {participante.fechaCreacion 
                        ? new Date(participante.fechaCreacion).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-eliminar-admin"
                        onClick={() => eliminarParticipante(participante.id, participante.nombre)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-info">
          <p>
            <strong>Total de participantes:</strong> {participantes.length}
          </p>
        </div>
      </main>
    </div>
  )
}

export default Administrar
