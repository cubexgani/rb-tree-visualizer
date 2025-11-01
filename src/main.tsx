import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import TApp from './tApp'
import { RBTreePage } from './pages/RBTreePage'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* <TApp /> */}
        <RBTreePage />
    </StrictMode>,
)
