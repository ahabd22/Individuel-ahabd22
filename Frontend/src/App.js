import React, { useState } from 'react'
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { MainLayout } from './styles/Layouts'
import Navigation from './components/Navigation/Navigation'
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income'
import Expenses from './components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
import StockData from './components/StockData/StockData';
import Login from './components/Login/Login';
import Register from './components/Registration/Register';

function App() {
  const [active, setActive] = useState(1)
  const { token } = useGlobalContext()

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Income />
      case 3:
        return <Expenses />
      case 4:
        return <StockData />
      default:
        return <Dashboard />
    }
  }

  return (
      <AppStyled className="App">
        <Router>
          <Routes>
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
            <Route path="/" element={
              token ? (
                  <MainLayout>
                    <Navigation active={active} setActive={setActive} />
                    <main>
                      {displayData()}
                    </main>
                  </MainLayout>
              ) : (
                  <Navigate to="/login" />
              )
            } />
          </Routes>
        </Router>
      </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-color: white;
  position: relative;

  main {
    flex: 1;
    background: white;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;