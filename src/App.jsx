import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/Home/HomePage';
import MenuPage from './pages/Menu/Menu';
import ReservePage from './pages/Reserve/ReservePage'; 
import './styles/App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="reserve" element={<ReservePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;