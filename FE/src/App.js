import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Landing from './pages/Landing';
import { initialiseAxios, wakeUpandCheckUser } from './services/auth';
import { Spinner } from 'react-bootstrap';
import Verify from './pages/Verify';
import Profile from './pages/Profile';

function App() {
  const [checking, setChecking] = useState(true);
  const [isAuth, setAuth] = useState(false);
  const [user, setUser] = useState({});

  // On page load, Send request to server to verify if user has a valid JWT and set state according to the response
  useEffect(() => {
    wakeUpandCheckUser().then(({signedin, message, userInfo}) => {
      if(!signedin) return;
      setAuth(true);
      setUser(userInfo);
    }).catch(err => console.log(err)).finally(() => setChecking(false));
    initialiseAxios();
  }, []);

  return (
    <div className="App min-vh-100 d-flex flex-column site-bg">
      <Router>
        <NavBar resetUser={() => {setAuth(false); setUser({});}} isAuth={isAuth} user={user}/>
        <div className="flex-grow-1 d-flex flex-column">
          {
            // Render content based on user auth status
            checking === true ? (
              <Spinner className="m-auto" animation="grow" size="lg" variant="primary"/>
            ) : (
              <Routes>
                <Route exact path="/" element={isAuth ? <Navigate to="/home"/> : <Navigate to="/landing"/>}/>
                <Route path="/home" element={isAuth ? <Home user={user}/> : <Navigate to="/landing"/>}/>
                <Route path="/profile" element={isAuth ? <Profile user={user}/> : <Navigate to="/landing"/>}/>
                <Route path="/landing" element={!isAuth ? <Landing setUser={setUser} setAuth={setAuth} isAuth={isAuth}/> : <Navigate to="/home"/>}/>
                <Route path="/verify/:userId" element={<Verify/>}/>
                <Route path="*" element={<Navigate to="/"/>} />
              </Routes>
            )
          }
        </div>
      </Router>
      <ScrollToTop/>
      <Footer/>
    </div>
  )
}

export default App;
