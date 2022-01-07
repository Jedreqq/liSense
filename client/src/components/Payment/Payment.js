import { useEffect, useState } from "react";
import Button from "../Button/Button";

import classes from "./Payment.module.css";

const Payment = (props) => {
  const courseNameTransform = props.courseName.split("___")[1];

  const datetime = new Date(props.statusUpdateDate)
    .toJSON()
    .slice(0, 16)
    .replace("T", " ");

  const changeStatusHandler = (e, curStatus) => {
    e.preventDefault();
    fetch("http://localhost:3001/changePaymentStatus", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        id: props.user._id,
        curStatus: curStatus,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a branch failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <tr>
      <td>{`${props.user.firstname} ${props.user.lastname}`}</td>
      <td>{courseNameTransform}</td>
      <td>{props.price}</td>
      <td>{props.status}</td>
      <td>{datetime}</td>
      <td>
        <Button onClick={(e) => changeStatusHandler(e, props.status)}>
          Change Status
        </Button>
      </td>
    </tr>
  );
};

export default Payment;
