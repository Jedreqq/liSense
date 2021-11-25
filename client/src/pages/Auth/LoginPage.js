import React from "react";
import { useState } from "react";

import Auth from "./Auth";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const LoginPage = (props) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });



  // const loginHandler = (e) => {
  //   e.preventDefault();
  //   console.log("Trying to log in.");
  //   fetch("http://localhost:3001/auth/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email: loginData.email,
  //       password: loginData.password,
  //     }),
  //   }).then((res) => {
  //     if (res.status === 422) {
  //       throw new Error("Validation failed.");
  //     }
  //     if (res.status !== 200 && res.status !== 201) {
  //       console.log("Error!");
  //       throw new Error("Could not authenticate you!");
  //     }
  //     return res.json();
  //   }).then(resData => {
  //     console.log(resData);
  //     setLoginStatus({...loginStatus, isAuth: true, token: resData.token, userId: resData.userId, userRole: resData.role});
  //     localStorage.setItem('token', resData.token);
  //     localStorage.setItem('userId', resData.userId);
  //     localStorage.setItem('userRole', resData.role);
  //     const remainingTime = 60 * 60 * 1000;
  //     const expireDate = new Date(new Date().getTime() + remainingTime);
  //     localStorage.setItem('expireDate', expireDate.toISOString());
  //   }).catch(err => {
  //     console.log(err);
  //     setLoginStatus({...loginStatus, isAuth: false})
  //   })
  // };
  return (
    <Auth>
      <form onSubmit={e => props.onLogin(e, {
        email: loginData.email,
        password: loginData.password
      })}>
        <Input
          id="email"
          label="E-Mail"
          type="email"
          control="input"
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value });
          }}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={(e) => {
            setLoginData({ ...loginData, password: e.target.value });
          }}
        />
        <Button type="submit">Log In</Button>
      </form>
    </Auth>
  );
};

export default LoginPage;
