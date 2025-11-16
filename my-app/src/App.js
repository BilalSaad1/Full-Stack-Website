import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Verify from './Verify';
import Home from './Home';
import Login from './Login';
import Mainpage from './Mainpage';
import Unauth from './Unauth';
import Adminpage from './Adminpage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path ="/verify" element={<Verify />}/>
        <Route path ="/mainpage" element={<Mainpage />}/>
        <Route path ="/unauth" element={<Unauth />}/>
        <Route path ="/adminpage" element= {<Adminpage />}/>
      </Routes>
    </Router>
  );
}

export default App;