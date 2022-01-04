import React, { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import classes from "./Payment.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from 'react-router-dom' 

const stripePromise = loadStripe(
  "pk_test_51KDYX8DHdY0p08Gpboe7Ogt4TxeirpMGdIKkhce8B8Pd0oTKnb7WgiGM2twulbtBUyBkxHKQYDX0bbBQ844K89es00Mt4PeK6D"
);


const Payment = (props) => {
  const [paymentData, setPaymentData] = useState({
    price: "",
    name: "",
    status: "",
  });

  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/studentPaymentData", {
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
        setPaymentData({
          name: resData.name,
          price: resData.price,
          status: resData.status,
        });
      });
    const query = new URLSearchParams(window.location.search);
    if (query.get("id")) {
      const id = query.getAll("id");
      fetch('http://localhost:3001/retrieveStripeObj', {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: id
        })
      })
    }
    if (query.get("canceled")) {
      setMsg("Try again.");
    }
  }, [props.loginStatus.token]);

  const payForCourseHandler = async (e) => {
    e.preventDefault();
    const stripeResp = await fetch("http://localhost:3001/payForCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        name: paymentData.name,
        price: paymentData.price,
        email: props.loginStatus.userMail,
      }),
    });
    if ((stripeResp.status !== 200) & (stripeResp.status !== 201)) {
      console.log("Error!");
      throw new Error("Failed.");
    }
    const { stripeObj } = await stripeResp.json();
    const { id: sessionId } = stripeObj;
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
    console.log(stripeObj);
  };

  return (
    <div className={classes.paymentData}>
      {paymentData.status === "unpaid" && (
          <div className={classes.container}>
            <script src="https://js.stripe.com/v3/"></script>{" "}
            <h3>Course Payment Details</h3> <p>Name: {paymentData.name}</p>
            <p>Price: {paymentData.price}zł</p>{" "}
            <Button onClick={payForCourseHandler} className={classes.button}>
              Pay for the course
            </Button>
          </div>
      )} {msg}
      {paymentData.status === "paid" && (
        <div>You already paid for the course.</div>
      )}
    </div>
  );
};

export default Payment;
