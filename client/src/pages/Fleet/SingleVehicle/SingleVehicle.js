import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";

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

  const [availableInstructors, setAvailableInstructors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSingleVehicle = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/fleet/" + vehicleId, {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch status");
      }
      const resData = await res.json();
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
      setAvailableInstructors(
        resData.instructors.map((instructor) => {
          return {
            ...instructor,
          };
        })
      );
    } catch (err) {
      console.log(err);
    }
  }, [props.loginStatus.token, vehicleId]);

  useEffect(
    () => loadSingleVehicle().finally((x) => setIsLoaded(true)),
    [loadSingleVehicle, setIsLoaded, props.loginStatus.token, vehicleId]
  );

  const setActiveInstructorHandler = async (e) => {
    try {
      setVehicleData({ ...vehicleData, assignedInstructor: e.target.value });

      const res = await fetch(
        "http://localhost:3001/assignInstructorToVehicle",
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedInstructor: e.target.value,
            curVehicle: vehicleId,
          }),
        }
      );
      if (res.status !== 200) {
        throw new Error("Failed to assign instructor.");
      }
      const resData = await res.json();
      console.log(resData);
    } catch (err) {
      console.log(err);
    }
  };

  return isLoaded ?
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
            vehicleData.categories.map((category) => (
              <p key={category._id}> {category.type} </p>
            ))
          )}{" "}
        </h5>
        <select
          value={vehicleData.assignedInstructor}
          name="instructor"
          id="instructor"
          label="Assign Instructor"
          onChange={setActiveInstructorHandler}
        >
          {availableInstructors.map((instructor) => {
            return (
              <option key={instructor._id} value={instructor._id}>
                {instructor.firstname + " " + instructor.lastname}
              </option>
            );
          })}
        </select>
      </div>
    </section> : <div className={classes.centered}> <Loader/> </div>
};

export default SingleVehicle;
