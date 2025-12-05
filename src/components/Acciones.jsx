import { Link } from 'react-router-dom'
import './Acciones.css'

function Acciones() {
  return (
    <div className="app">
      <header className="header">
        <h1>⚡ Acciones</h1>
        <p>Panel de control del intercambio</p>
      </header>

      <main className="main-content">
        <div className="acciones-grid">
          <Link to="/" className="accion-card">
            <div className="accion-icon">👥</div>
            <h3>Ver Participantes</h3>
            <p>Lista completa de todos los participantes</p>
          </Link>

          <Link to="/agregar" className="accion-card accion-primary">
            <div className="accion-icon">➕</div>
            <h3>Agregar Participante</h3>
            <p>Registra un nuevo participante al intercambio</p>
          </Link>

          <Link to="/configuracion" className="accion-card accion-config">
            <div className="accion-icon">⚙️</div>
            <h3>Configuración</h3>
            <p>Define presupuesto, fecha y lugar del evento</p>
          </Link>

          <Link to="/administrar" className="accion-card accion-admin">
            <div className="accion-icon">🔧</div>
            <h3>Administrar</h3>
            <p>Gestiona y elimina participantes</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Acciones
