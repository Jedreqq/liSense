import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
//import Button from "./components/Button/Button";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import HomePage from "./pages/Auth/HomePage";
import { useNavigate } from 'react-router-dom'
function App() {
  const [loginStatus, setLoginStatus] = useState({
    isAuth: false,
    token: null,
    userId: null,
    userRole: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expireDate = localStorage.getItem("expireDate");
    if (!token || !expireDate) {
      return;
    }
    if (new Date(expireDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");
    // const remainingTime = new Date(expireDate).getTime() - new Date().getTime();
    setLoginStatus((loginStatus) => ({
      ...loginStatus,
      isAuth: true,
      token: token,
      userId: userId,
      userRole: userRole,
    })); //use setState(state => ({...state,,,})) for preventing the useeffect setstate inf loop 
  }, []);


  const navigate = useNavigate();
  
  const signupHandler = (e, signupData) => {
    e.preventDefault();
    console.log("Trying to sign up.");
    fetch("http://localhost:3001/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: signupData.role,
        email: signupData.email,
        password: signupData.password,
        firstname: signupData.firstname,
        lastname: signupData.lastname,
        usercity: signupData.usercity,
        postalcode: signupData.postalcode,
        phonenumber: signupData.phonenumber,
        confirmpassword: signupData.confirmpassword,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a user failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        navigate('/login');
       })
      .catch((err) => console.log(err));
  };

  const loginHandler = (e, loginData) => {
    e.preventDefault();
    console.log("Trying to log in.");
    fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setLoginStatus({
          ...loginStatus,
          isAuth: true,
          token: resData.token,
          userId: resData.userId,
          userRole: resData.role,
        });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        localStorage.setItem("userRole", resData.role);
        const remainingTime = 60 * 60 * 1000;
        const expireDate = new Date(new Date().getTime() + remainingTime);
        localStorage.setItem("expireDate", expireDate.toISOString());
      })
      .catch((err) => {
        console.log(err);
        setLoginStatus({ ...loginStatus, isAuth: false });
      });
  };

  const logoutHandler = () => {
    setLoginStatus({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expireDate");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  };

  let routes = (
    <Routes>
      <Route path="/" exact element={<HomePage />}></Route>
      <Route
        path="/login"
        exact
        element={<LoginPage onLogin={loginHandler} />}
      ></Route>
      <Route path="/signup" exact element={<SignupPage onSignup={signupHandler} />}></Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
  if (loginStatus.isAuth) {
    routes = (
      <Routes>
        <Route
          path="/dashboard"
          exact
          element={
            <Dashboard loginStatus={loginStatus} onLogout={logoutHandler} />
          }
        />
        <Route  path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }
  return <Layout onLogout={logoutHandler} loginStatus={loginStatus}>{routes}</Layout>;
}

export default App;
