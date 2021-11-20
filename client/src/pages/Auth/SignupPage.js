import React from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Auth from "./Auth";

const SignupPage = (props) => {
  const signupHandler = (e) => {
      e.preventDefault();
    console.log("Trying to sign up.");
  };
  return (
    <Auth>
      <p>This will be signup page.</p>
      <form onSubmit={signupHandler}>
        <Input id="email" label="E-Mail" type="email" control="input" />
        <Input id="firstname" label="Firstname" type="text" control="input" />
        <Input id="lastname" label="Lastname" type="text" control="input" />
        <Input id="password" label="Password" type="password" control="input" />
        <Input id="confirmPassword" label="Confirm Password" type="password" control="input" />
        <label>YOUR ROLE </label>
        <br/>
        <select name="roles" id="roles" label="Your Role">
            <option value="student">Student</option>
            <option value="student">Instructor</option>
            <option value="student">Owner</option>
        </select>
        <div>
        <Button type="submit">Signup</Button>
        </div>
      </form>
    </Auth>
  );
};

export default SignupPage;
