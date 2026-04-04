import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LiveView from './components/LiveView.jsx'

const params = new URLSearchParams(window.location.search);
const liveCode = params.get('live');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {liveCode ? <LiveView matchCode={liveCode} /> : <App />}
  </StrictMode>,
)
