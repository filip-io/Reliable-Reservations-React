import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/Home/HomePage';
import ReservePage from './pages/Reserve/ReservePage'; 
import './styles/App.css'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="reserve" element={<ReservePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;