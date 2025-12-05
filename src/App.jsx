import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ListaParticipantes from './components/ListaParticipantes'
import AgregarParticipante from './components/AgregarParticipante'
import Configuracion from './components/Configuracion'
import Administrar from './components/Administrar'
import Acciones from './components/Acciones'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListaParticipantes />} />
        <Route path="/agregar" element={<AgregarParticipante />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/administrar" element={<Administrar />} />
        <Route path="/acciones" element={<Acciones />} />
      </Routes>
    </Router>
  )
}

export default App
