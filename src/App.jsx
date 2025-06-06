import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainTemplate from '@/components/templates/MainTemplate'
import HomePage from '@/components/pages/HomePage'
import Dashboard from '@/components/pages/Dashboard'
import Tracking from '@/components/pages/Tracking'
import Analytics from '@/components/pages/Analytics'
import NotFound from '@/pages/NotFound'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Router>
      <MainTemplate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
</MainTemplate>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mobile:top-4 mobile:right-4 mobile:left-4 mobile:w-auto"
        toastClassName="mobile:text-sm mobile:p-3"
        bodyClassName="mobile:text-sm"
        progressClassName="mobile:h-1"
      />
    </Router>
  )
}

export default App