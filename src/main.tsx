import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router'
import App from "./App.tsx"
import LayoutGuest from './components/layout/LayoutGuest.tsx'
import Login from './components/auth/login.tsx'
import Register from './components/auth/register.tsx'
import NotFound from './components/NotFound.tsx'
import Gallery from './components/products/gallery.tsx'
import SignOut from './components/auth/signout.tsx'
import EditProfile from './components/auth/edit_profile.tsx'
import ShowProduct from './components/dashboard/ShowProduct.tsx'
import ShopingCart from './components/products/shoping_cart.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <LayoutGuest>
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/*<Route path="/gallery/:uid" element={<Gallery />} />*/}
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/edit_profile" element={<EditProfile />} />
      <Route path="/dashboard" element={<ShowProduct />} />
      <Route path="/signout" element={<SignOut />} />
      <Route path="/shoping_cart" element={<ShopingCart />} />
    </Routes>
    </LayoutGuest>
  </BrowserRouter>
  </StrictMode>,
)
