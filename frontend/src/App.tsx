import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import RegisterPage from './pages/RegisterPage'
import SubscribePage from './pages/SubscribePage'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupsPage'

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path="/register" element={<RegisterPage/>}></Route>
          <Route path="/subscriptions" element={<SubscribePage/>}></Route>
          <Route path="/notifications" element={<NotificationsPage/>}></Route>
          <Route path="/home" element={<HomePage/>}></Route>
          <Route path="/groups" element={<GroupPage/>}></Route>
        </Routes>
    </Router>
  )
}

export default App
