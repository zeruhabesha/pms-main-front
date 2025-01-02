import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import './styles.css'
import App from './App'
import ErrorBoundary from './ErrorBoundary' // Import ErrorBoundary
import store from './api/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
      <ToastContainer />
    </ErrorBoundary>
  </Provider>,
)