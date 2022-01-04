import React, { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import ButtonLink from "../../../components/ButtonLink/ButtonLink";
import classes from "./StudentDash.module.css";

const StudentDash = (props) => {
  const [attendedCourseId, setAttendedCourseId] = useState();
  const [paymentStatus, setPaymentStatus] = useState();

  
  useEffect(() => {
    setAttendedCourseId();
    setPaymentStatus();
    fetch("http://localhost:3001/studentData", {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch courses.");
        }
        return res.json();
      })
      .then((resData) => {
        setAttendedCourseId(resData.attendedCourseId);
        setPaymentStatus(resData.status);
      });

      const query = new URLSearchParams(window.location.search);
      if(query.get("success")) {
        console.log('hehehehehe')
      }
      if(query.get('canceled')) {
        console.log('no i sie nie udalo');
      }

  }, [props.loginStatus.token]);

  
  return (
    <div>
      {paymentStatus === "unpaid" && (
        <div>
          You need to pay for the course first!
          <ButtonLink link="/payment">
            <Button>Pay</Button>
          </ButtonLink>
        </div>
      )}
      {paymentStatus === "paid" && <div>What You want to do today?</div>}
    </div>
  );
};

export default StudentDash;
