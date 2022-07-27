import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

if (import.meta.env.MODE == "production") {
  import("vite-plugin-deploy-log").then(({ showDeployLog }) => {
    showDeployLog();
  });
}