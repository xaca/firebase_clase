import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router'
import App from "./App.tsx"
import LayoutGuest from './components/layout/LayoutGuest.tsx'
import Login from './components/auth/login.tsx'
import Register from './components/auth/register.tsx'
import Menu from './components/ui/Menu.tsx'
import NotFound from './components/NotFound.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Menu />
    <LayoutGuest>
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </LayoutGuest>
  </BrowserRouter>
  </StrictMode>,
)
