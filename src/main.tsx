import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RBTreePage } from './pages/RBTreePage'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RBTreePage />
    </StrictMode>,
)
