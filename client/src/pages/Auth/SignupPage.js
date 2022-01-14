import React, { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Auth from "./Auth";
import classes from "./Auth.module.css";

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
    categories: [],
  });

  const checkCategoriesHandler = (e) => {
    let categoriesList = signupData.categories;
    let isChecked = e.target.checked;
    let checkedCategory = e.target.value;
    if (isChecked) {
      setSignupData((prevState) => ({
        ...prevState,
        categories: [...prevState.categories.concat(checkedCategory)],
      }));
    } else {
      var index = categoriesList.indexOf(checkedCategory);
      if (index > -1) {
        setSignupData((prevState) => ({
          ...prevState,
          categories: [...prevState.categories.filter(element => element !== categoriesList[index])],
        }));
        //setInstructorCategories(categoriesList);
      }
    }
  };

  const categoriesOptions = [
    "A",
    "A1",
    "A2",
    "B",
    "B1",
    "C",
    "C1",
    "D",
    "D1",
    "B+E",
    "C+E",
    "D+E",
    "T",
  ].map((cur, index) => {
    return (
      <div key={index}>
        <label>
          <input
            type="checkbox"
            name={cur}
            value={cur}
            onChange={checkCategoriesHandler}
          />
          {cur}
        </label>
      </div>
    );
  });
  let isInstructor = signupData.role === "instructor";

  return (
    <Auth>
      <form
        onSubmit={(e) =>
          props.onSignup(e, {
            role: signupData.role,
            email: signupData.email,
            password: signupData.password,
            firstname: signupData.firstname,
            lastname: signupData.lastname,
            usercity: signupData.usercity,
            postalcode: signupData.postalcode,
            phonenumber: signupData.phonenumber,
            confirmpassword: signupData.confirmpassword,
            categories: signupData.categories,
          })
        }
      >
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
            type="text"
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
              <div className={classes.categories}>{categoriesOptions}</div>
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
