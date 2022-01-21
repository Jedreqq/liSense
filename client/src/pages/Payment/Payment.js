import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import classes from "./Payment.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const stripePromise = loadStripe(
  "pk_test_51KDYX8DHdY0p08Gpboe7Ogt4TxeirpMGdIKkhce8B8Pd0oTKnb7WgiGM2twulbtBUyBkxHKQYDX0bbBQ844K89es00Mt4PeK6D"
);

const Payment = (props) => {
  const [paymentData, setPaymentData] = useState({
    price: "",
    name: "",
    status: "",
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [msg, setMsg] = useState("");

  const loadPayment = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/studentPaymentData", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch courses.");
      }
      const resData = await res.json();
      setPaymentData({
        name: resData.name,
        price: resData.price,
        status: resData.status,
      });
      const query = new URLSearchParams(window.location.search);
      if (query.get("id")) {
        const id = query.getAll("id");
        await fetch("http://localhost:3001/retrieveStripeObj", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: id,
          }),
        });
        setIsChanged(true);
      }
      if (query.get("canceled")) {
        setMsg("Try again.");
      }
    } catch (err) {
      console.log(err);
    }
  }, [props.loginStatus.token, setIsChanged]);

  useEffect(
    () => loadPayment().finally((x) => setIsLoaded(true)),
    [loadPayment, setIsLoaded, props.loginStatus.token, isChanged]
  );

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

  return isLoaded ? (
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
      )}{" "}
      {msg}
      {paymentData.status === "paid" && (
        <div>You already paid for the course.</div>
      )}
    </div>
  ) : (
    <div className={classes.centered}>
      {" "}
      <Loader />{" "}
    </div>
  );
};

export default Payment;
