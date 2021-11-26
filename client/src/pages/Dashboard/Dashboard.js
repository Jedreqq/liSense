import React, { useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import classes from './Dashboard.module.css';

const Dashboard = (props) => {
  const [role, setRole] = useState("");
  const [hasCreatedSchool, setHasCreatedSchool] = useState(null);
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
      });
  }, [props.loginStatus.token]);

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
          <form className={classes.createSchoolForm}>
            <Input
              id="schoolname"
              label="Driving School Name"
              type="text"
              control="input"
            />
            {/* <Input id="schoolcity" label="City" type="text" control="input" />
            <Input
              id="schoolpostalcode"
              label="Postal Code"
              type="text"
              control="input"
            />
            <Input
              id="schooladdress"
              label="Address"
              type="text"
              control="input"
            /> */}
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
