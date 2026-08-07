import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./assets/Landing";
import Login from "./assets/Login";
import Signup from "./assets/Signup";
import Home from "./assets/Home";
import Profile from "./assets/Profile";

import BackButton from "./assets/components/BackButton";

function Layout({children}){
  return(
    <div >
      <BackButton />
      {children}
    </div>
  );
}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route 
          path="/" 
          element={<Landing />} 
        />


        <Route 
          path="/login" 
          element={
            <Layout>
              <Login />
            </Layout>
          } 
        />


        <Route 
          path="/signup" 
          element={
            <Layout>
              <Signup />
            </Layout>
          } 
        />


        <Route 
          path="/home" 
          element={
            <Layout>
              <Home />
            </Layout>
          } 
        />


        <Route 
          path="/profile" 
          element={
            <Layout>
              <Profile />
            </Layout>
          } 
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;