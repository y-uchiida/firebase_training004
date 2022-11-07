import Header from './components/Header'
import { AuthProvider } from './provider/AuthProvider'

function App() {

  return (
    <AuthProvider>
      <div className="App">
        <Header></Header>
      </div>
    </AuthProvider>
  )
}

export default App
