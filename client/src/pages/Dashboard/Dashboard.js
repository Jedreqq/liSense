import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import classes from "./Dashboard.module.css";

const Dashboard = (props) => {
  const [role, setRole] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [hasCreatedSchool, setHasCreatedSchool] = useState(false); //if school created by owner he gets redirected to his school
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:3001/dashboard", {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch user status.");
        }
        return res.json();
      })
      .then((resData) => {
        setRole(resData.role);
        setHasCreatedSchool(resData.hasSchool);
        if (role === "owner" && hasCreatedSchool) {
          navigate("/school");
        }
      });
  }, [props.loginStatus.token, hasCreatedSchool, navigate, role]);

  const createSchoolHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/createSchool", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        name: schoolName,
      }),
    })
      .then((res) => {
        if ((res.status !== 200) & (res.status !== 201)) {
          console.log("Error!");
          throw new Error("Creating new school failed.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      });
  };

  let isStudent = role === "student";
  let isInstructor = role === "instructor";
  let isOwner = role === "owner";

  return (
    <div>
      <p>Hello there, authenticated man, are you a {role}? </p>
      {(isStudent || isInstructor) && (
        <p>
          Great! Let's find your driving school, you need to enter a city or
          school name...
        </p>
      )}
      {isOwner && !hasCreatedSchool && (
        <div>
          <p>
            Great! Let's create your group by entering the general information
            about your driving school...
          </p>
          <form
            onSubmit={createSchoolHandler}
            className={classes.createSchoolForm}
          >
            <Input
              id="schoolname"
              label="Driving School Name"
              type="text"
              control="input"
              onChange={(e) => {
                setSchoolName(e.target.value);
              }}
            />
            <div className={classes.btndiv}>
              <Button type="submit">Create School</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
