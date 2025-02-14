import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Create from './components/Create'
import Main from './components/Main'
import HomePage from './components/Home'
import Share from './components/Share'

function App() {
  return (
   <Routes>
  <Route path="/create" element={<Create />} />
  <Route path="/room/:roomId" element={<Main />} />
  <Route path="/" element={<HomePage />} />
  <Route  path="/share/:room" element={<Share />} /> 
   </Routes>
  )
}

export default App