import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dump from './components/fragments/dump'
import { WalletProvider } from './context/WalletContext'
import './index.css'
import NotFound from './pages/404'
import Account from './pages/Account'
import Chatbot from './pages/Chatbot'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import OTPVerification from './pages/OTPVerification'
import Register from './pages/Register'
import Transaction from './pages/Transaction'
import Wallet from './pages/Wallet'

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Hello World</h1>,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/transaction',
    element: <Transaction />,
  },
  {
    path: '/wallet',
    element: <Wallet />,
  },
  {
    path: '/chatbot',
    element: <Chatbot />,
  },
  {
    path: '/account',
    element: <Account />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/auth/otp-verification',
    element: <OTPVerification />,
  },
  {
    path: '/trying',
    element: <Dump />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  </StrictMode>,
)
