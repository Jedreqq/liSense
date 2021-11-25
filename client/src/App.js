import { useEffect, useState } from "react";
import { Routes, Navigate, Route } from "react-router-dom";
import "./App.css";
import Button from "./components/Button/Button";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import HomePage from './pages/Auth/HomePage';
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
    setLoginStatus({
      ...loginStatus,
      isAuth: true,
      token: token,
      userId: userId,
      userRole: userRole,
    });
  }, []);

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
      <Route path="/" exact element={<HomePage/>}></Route>
      <Route
        path="/login"
        exact
        element={<LoginPage onLogin={loginHandler} />}
      ></Route>
      <Route path="/signup" exact element={<SignupPage />}></Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
  if (loginStatus.isAuth) {
    routes = (
      <Routes>
        <Route path="/user/dashboard" exact element={<Dashboard loginStatus={loginStatus} onLogout={logoutHandler} />} />
        <Route path="*" element={<Navigate to="/user/dashboard" />} />
      </Routes>
    );
  }
  return <Layout>{routes}</Layout>;
}

export default App;
