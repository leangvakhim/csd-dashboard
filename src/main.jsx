import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'jquery';
import 'simplebar';
import 'apexcharts';
import '@preline/dropdown';
import '@preline/overlay';
import 'iconify-icon';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
