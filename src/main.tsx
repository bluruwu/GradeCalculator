import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GradeCalculator from './GradeCalculator.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GradeCalculator />
  </StrictMode>,
)
