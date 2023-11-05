import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hse from './Components/Hse';

function App() {
  return (
    <Router>
    <Routes>
      <Route path='/*' element={<Hse />} />
    </Routes>
  </Router>
  );
}

export default App;
