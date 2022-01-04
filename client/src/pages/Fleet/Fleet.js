import { useState, useEffect } from "react";
import Vehicle from "../../components/Vehicle/Vehicle";
import CreateVehicle from "./CreateVehicle";
import classes from "./Fleet.module.css";

const Fleet = (props) => {
  const [vehicles, setVehicles] = useState({
    vehicles: [],
  });

  const [showCreateVehicleCart, setShowCreateVehicleCart] = useState(false);

  useEffect(() => {
      fetch("http://localhost:3001/fleet", {
          headers: {
              Authorization: "Bearer " + props.loginStatus.token,
          }
      }).then(res => {
        if (res.status !== 200) {
            throw new Error("Failed to fetch vehicles.");
          }
          return res.json();
      }).then(resData => {
          console.log(resData.vehicles);
          setVehicles(vehiclesInfo => ({
              ...vehiclesInfo,
              vehicles: resData.vehicles.map((vehicle) => {
                  return {
                      ...vehicle
                  };
              })
          })); 
      }).catch(err => {
          console.log(err);
      });

    //   fetch("http://localhost:3001/getVehicleCategories", {
    //       headers: {
    //           Authorization: "Bearer " + props.loginStatus.token,
    //       }
    //   })
  }, [props.loginStatus.token])

  const showCreateVehicleCartHandler = (e) => {
    e.preventDefault();
    setShowCreateVehicleCart((prevState) => !prevState);
  };

  let buttonContent = "Show Vehicle Creator";

  if (showCreateVehicleCart) {
    buttonContent = "Hide Vehicle Creator";
  }

  return (
    <div>
      <div className={classes.vehiclesDiv}>
        <button onClick={showCreateVehicleCartHandler}>{buttonContent}</button>
        {showCreateVehicleCart && (
          <CreateVehicle loginStatus={props.loginStatus} activeBranch={props.activeBranch}/>
        )}
        <h2>Vehicles in branch</h2>
        {vehicles.vehicles.length === 0 && <p>No vehicles in branch.</p>}
        {vehicles.vehicles.length > 0 &&
          vehicles.vehicles.map((vehicle) => (
            <Vehicle
              loginStatus={props.loginStatus}
              key={vehicle._id}
              id={vehicle._id}
              model={vehicle.model}
              brand={vehicle.brand}
              registrationPlate={vehicle.registrationPlate}
              year={vehicle.year}
              categories={vehicle.categories}
            />
          ))}
      </div>
    </div>
  );
};

export default Fleet;
