import React, { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Auth from "./Auth";
import classes from "./Auth.module.css";
import { useNavigate } from 'react-router-dom';

// const initialValues = {
//   role: "student",
//   email: "",
//   password: "",
//   firstname: "",
//   lastname: "",
//   usercity: "",
//   postalcode: "",
//   phonenumber: "",
//   confirmpassword: ""
// };

const SignupPage = (props) => {
  const [signupData, setSignupData] = useState({
    role: "student",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    usercity: "",
    postalcode: "",
    phonenumber: "",
    confirmpassword: "",
  });

  const navigate = useNavigate();
  
  const signupHandler = (e) => {
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

  let isInstructor = signupData.role === "instructor";

  return (
    <Auth>
      <form onSubmit={signupHandler}>
        <div>
          <label>YOUR ROLE </label>
          <br />
          <br />
          <select
            name="role"
            id="role"
            label="Your Role"
            onChange={(e) => {
              setSignupData({ ...signupData, role: e.target.value });
            }}
            // value={values.role}
            // onChange={handleInputChange}
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div className={classes.signupBox}>
          <Input
            id="email"
            label="E-Mail"
            type="email"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, email: e.target.value });
            }}
          />
          <Input
            id="firstname"
            label="Firstname"
            type="text"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, firstname: e.target.value });
            }}
          />
          <Input
            id="lastname"
            label="Lastname"
            type="text"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, lastname: e.target.value });
            }}
          />
          <Input
            id="phonenumber"
            label="Phone Number"
            type="number"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, phonenumber: e.target.value });
            }}
          />
          <Input
            id="usercity"
            label="Your City"
            type="text"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, usercity: e.target.value });
            }}
          />
          <Input
            id="postalcode"
            label="Postal Code"
            type="number"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, postalcode: e.target.value });
            }}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, password: e.target.value });
            }}
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            control="input"
            onChange={(e) => {
              setSignupData({ ...signupData, confirmpassword: e.target.value });
            }}
          />
          {isInstructor && (
            <div>
              <p>CHOOSE YOUR CATEGORIES</p>
              <Input
                id="cat_a_a1_a2"
                label="A, A1, A2"
                type="checkbox"
                control="input"
              />
              <Input
                id="cat_b_b1"
                label="B, B1"
                type="checkbox"
                control="input"
              />
              <Input
                id="cat_c_c1"
                label="C, C1"
                type="checkbox"
                control="input"
              />
              <Input
                id="cat_d_d1"
                label="D, D1"
                type="checkbox"
                control="input"
              />
              <Input id="cat_be" label="B+E" type="checkbox" control="input" />
              <Input id="cat_ce" label="C+E" type="checkbox" control="input" />
              <Input id="cat_de" label="D+E" type="checkbox" control="input" />
              <Input id="cat_t" label="T" type="checkbox" control="input" />
            </div>
          )}
        </div>
        <div className={classes.btndiv}>
          <Button type="submit">Signup</Button>
        </div>
      </form>
    </Auth>
  );
};

export default SignupPage;
