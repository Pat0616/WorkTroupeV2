import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import RegisterPage from './pages/RegisterPage'
import SubscribePage from './pages/SubscribePage'

function App() {

  return (
    <Router>
      <NotificationsPage/>
    </Router>
  )
}

export default App
