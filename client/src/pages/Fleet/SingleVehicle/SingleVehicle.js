import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import classes from "./SingleVehicle.module.css";

const SingleVehicle = (props) => {
  const { vehicleId } = useParams();
  console.log(vehicleId);

  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    year: "",
    registrationPlate: "",
    branchId: "",
    assignedInstructor: "",
    categories: [],
  });

  useEffect(() => {
    fetch("http://localhost:3001/fleet/" + vehicleId, {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setVehicleData((vehicleInfo) => ({
          ...vehicleInfo,
          brand: resData.vehicle.brand,
          model: resData.vehicle.model,
          year: resData.vehicle.year,
          registrationPlate: resData.vehicle.registrationPlate,
          branchId: resData.vehicle.branchId,
          assignedInstructor: resData.vehicle.userId,
          categories: resData.vehicle.categories.map((category) => {
            return {
              ...category,
            };
          }),
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.loginStatus.token, vehicleId]);

  console.log(vehicleData);

  return (
    <section>
      <div className={classes.vehicleDiv}>
        <h3>
          {vehicleData.brand} {vehicleData.model}, {vehicleData.year}
        </h3>
        <h4>Registration Plate: {vehicleData.registrationPlate}</h4>
        <h5>
          Categories:{" "}
          {vehicleData.categories.length === 0 ? (
            <p>No categories added to Vehicle.</p>
          ) : (
            vehicleData.categories.map((category) => <p> {category.type} </p>)
          )}{" "}
        </h5>
        {/* {courseData.name} TU JESTEM HEHEHHEE {courseData.price}
      <div className={classes.usersDiv}>
        <h2>Students in Course</h2>
        {courseData.studentList.length === 0 && (
          <p>No students in the course.</p>
        )}
        {courseData.studentList.length > 0 &&
          courseData.studentList.map((student) =>
            student.payments.map(
              (payment) =>
                payment.status === "paid" && (
                  <Student
                    paymentStatus={payment.status}
                    loginStatus={props.loginStatus}
                    key={student._id}
                    id={student._id}
                    firstname={student.firstname}
                    lastname={student.lastname}
                    email={student.email}
                    phoneNumber={student.phoneNumber}
                    isMember={student.memberId}
                  />
                )
            )
          )}
        <p>And those that not paid yet:</p>
        {courseData.studentList.length > 0 &&
          courseData.studentList.map((student) =>
            student.payments.map(
              (payment) =>
                payment.status === "unpaid" && (
                  <Student
                    paymentStatus={payment.status}
                    loginStatus={props.loginStatus}
                    key={student._id}
                    id={student._id}
                    firstname={student.firstname}
                    lastname={student.lastname}
                    email={student.email}
                    phoneNumber={student.phoneNumber}
                    isMember={student.memberId}
                  />
                )
            )
          )} */}
      </div>
    </section>
  );
};

export default SingleVehicle;
