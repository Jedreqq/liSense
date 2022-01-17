import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import ButtonLink from "../../../components/ButtonLink/ButtonLink";
import Loader from "../../../components/Loader/Loader";
import classes from "./StudentDash.module.css";

const StudentDash = (props) => {
  const [attendedCourseId, setAttendedCourseId] = useState();
  const [paymentStatus, setPaymentStatus] = useState();

  const [isLoaded, setIsLoaded] = useState(false);

  const loadStudentDash = useCallback(async() => {
    try {

      setAttendedCourseId();
      setPaymentStatus();
      const res = await fetch("http://localhost:3001/studentData", {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      if (res.status !== 200) {
        throw new Error("Failed to fetch student data.");
      }
      const resData = await res.json();
 
      setAttendedCourseId(resData.attendedCourseId);
      setPaymentStatus(resData.status);
    
  } catch(err) {
    console.log(err);
  }

      // const query = new URLSearchParams(window.location.search);
      // if(query.get("success")) {
      //   console.log('hehehehehe')
      // }
      // if(query.get('canceled')) {
      //   console.log('no i sie nie udalo');
      // }

  }, [props.loginStatus.token])

  useEffect(() => loadStudentDash().finally(x => setIsLoaded(true)), [setIsLoaded, loadStudentDash, props.loginStatus.token]);

  
  return isLoaded ?
    <div>
      {!attendedCourseId && <p>You are a new member of branch. Go to <ButtonLink link='/courses'>Courses</ButtonLink> page to choose course You want to attend to.</p>}
      {paymentStatus === "unpaid" && (
        <div>
          You need to pay for the course first!
          <ButtonLink link="/payment">
            <Button>Pay</Button>
          </ButtonLink>
        </div>
      )}
      {paymentStatus === "paid" && <div>What You want to do today?</div>}
    </div> : <div className={classes.centered}>
      <Loader />
    </div>
};

export default StudentDash;
