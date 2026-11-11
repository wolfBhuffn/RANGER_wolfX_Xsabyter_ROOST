import { createRoot } from 'react-dom/client'
import './index.css' // <-- Must be present!
import HomePage from './pages/HomePage.tsx'

createRoot(document.getElementById('root')!).render(
  <HomePage />
)
