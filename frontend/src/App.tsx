//import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes ,useLocation } from 'react-router-dom';
import Login from './Page/Login/Login';
import SignUp from './Page/SignUp/SignUp';
import Main from './Page/MainWeb/Main';
import { NavBar } from './Page/Component/NavBar';
import BooksInput from "./Page/Books/Books";
import Viewtable from "./Page/Books/Getmachine";



const App: React.FC = () => {
  const location = useLocation();
  const Navbar = ["/Main","/Store","/SubStore","/BookStore","/Admin","/AdminStore","/Hall","/Inbox","/StorePayment","/BillStore"].includes(location.pathname);
  return (
    <>
      {Navbar && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/BooksInput" element={<BooksInput />} />
        <Route path="/Viewtable" element={<Viewtable />} />

        
      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
      <App />
  </Router>
);

export default AppWrapper;
