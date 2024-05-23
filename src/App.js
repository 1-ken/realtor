import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./Components/Header";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Router>
      <Header/>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/sign-in" element={<Signin/>}/>
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/offer" element={<Offer/>}/>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App; 
