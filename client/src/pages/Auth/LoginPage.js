import React from "react";
import { useState } from "react";

import Auth from "./Auth";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const LoginPage = (props) => {
 
  const loginHandler = (e) => {
    e.preventDefault();
    console.log("Trying to log in.");
  };
  return (
    <Auth>
      <p>Log In Here.</p>
      <form onSubmit={loginHandler}>
        <Input id="email" label="E-Mail" type="email" control="input"/>
        <Input id="password" label="Password" type="password" control="input" />
        <Button type="submit">Log In</Button>
      </form>
    </Auth>
  );
};

export default LoginPage;
