import Header from './components/Header'
import { AuthProvider } from './provider/AuthProvider'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/pages/Home';
import UploadVideo from './components/pages/VideoUpload';
import { Container } from '@mui/material';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Container sx={{ mt: 1 }}>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/upload' element={<UploadVideo />}></Route>
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  )
}

export default App
