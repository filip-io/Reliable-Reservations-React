import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservePage from './pages/ReservePage'; 
import './App.css'; 

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