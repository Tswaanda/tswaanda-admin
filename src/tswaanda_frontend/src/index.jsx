import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../assets/main.css'
import { Provider } from 'react-redux';
import { api } from "./state/api"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './state/Store';
import { ContextProvider } from './hooks/auth';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <App />
      </ContextProvider>
      <ToastContainer />
    </Provider>
  </React.StrictMode>,
)
