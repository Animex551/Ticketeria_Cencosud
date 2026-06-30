import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './Layouts/App'
import "./styles/Styles.scss"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)