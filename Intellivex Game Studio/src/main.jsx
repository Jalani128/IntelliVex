import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { StudioGamesProvider } from './hooks/useStudioGames'
import { StudioNewsProvider } from './hooks/useStudioNews'
import { StudioCareersProvider } from './hooks/useStudioCareers'
import './styles/index.css'
import './styles/card-motion.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
    <StudioGamesProvider><StudioNewsProvider><StudioCareersProvider><App /></StudioCareersProvider></StudioNewsProvider></StudioGamesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
