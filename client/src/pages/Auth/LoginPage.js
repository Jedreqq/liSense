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
