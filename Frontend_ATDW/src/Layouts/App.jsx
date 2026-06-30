import Menu from "./Menu"
import Rutas from './Rutas'
import Footer from "./Footer"
import "../styles/Styles.scss"

function App() {
  return (
    <div >
      <Menu />
      <main>
        <Rutas />
      </main>
      <Footer />
    </div>
  )
}
export default App;