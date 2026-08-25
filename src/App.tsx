import { Navigate, Route, Routes } from 'react-router-dom'
import { ClientPage } from './pages/ClientPage'
import { ConformePage } from './pages/ConformePage'
import { HomePage } from './pages/HomePage'
import { TalentPage } from './pages/TalentPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/terms" element={<TalentPage />} />
      <Route path="/new" element={<Navigate to="/terms" replace />} />
      <Route path="/c" element={<ClientPage />} />
      <Route path="/conforme" element={<ConformePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
