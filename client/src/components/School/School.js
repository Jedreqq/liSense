import { useCallback, useEffect, useState } from "react";
import Loader from "../Loader/Loader";

import classes from './School.module.css';

const School = (props) => {
  const [schoolDetails, setSchoolDetails] = useState({
    schoolName: "",
    schoolOwner: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const loadSchool = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/school", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch owner's school.");
      }
      const resData = await res.json();
      setSchoolDetails({
        schoolName: resData.schoolName,
        schoolOwner: resData.schoolOwner,
      });
    } catch (err) {
      console.log(err);
    }
  }, [props.loginStatus.token]);

  useEffect(
    () => loadSchool().finally((x) => setIsLoaded(true)),
    [loadSchool, setIsLoaded, props.loginStatus.token]
  );

  return isLoaded ?
    <div>
      <p>Welcome {schoolDetails.schoolOwner}</p>
      <hr />
      <p>Your School: {schoolDetails.schoolName}</p>
    </div>
  : <div className={classes.centered}> <Loader/> </div>
};

export default School;
