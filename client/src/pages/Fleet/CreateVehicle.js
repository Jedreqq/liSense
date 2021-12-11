import { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import classes from "./Fleet.module.css";

const CreateVehicle = (props) => {
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    year: "",
    registrationPlate: "",
    categories: []
  });

  const checkCategoriesHandler = (e) => {
    let categoriesList = vehicleData.categories;
    let isChecked = e.target.checked;
    let checkedCategory = e.target.value;
    if (isChecked) {
      setVehicleData((prevState) => ({
        ...prevState,
        categories: [...prevState.categories.concat(checkedCategory)],
      }));
    } else {
      var index = categoriesList.indexOf(checkedCategory);
      if (index > -1) { 
        setVehicleData((prevState) => ({
          ...prevState,
          categories: [...prevState.categories.filter(element => element !== categoriesList[index])],
        }));
      }
    }
  };

  const categoriesOptions = [
    "A",
    "A1",
    "A2",
    "B",
    "B1",
    "C",
    "C1",
    "D",
    "D1",
    "B+E",
    "C+E",
    "D+E",
    "T",
  ].map((cur, index) => {
    return (
      <div key={index}>
        <label>
          <input
            type="checkbox"
            name={cur}
            value={cur}
            onChange={checkCategoriesHandler}
          />
          {cur}
        </label>
      </div>
    );
  });

  const createVehicleHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/createVehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        registrationPlate: vehicleData.registrationPlate,
        categories: vehicleData.categories
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
      .catch((err) => {
        console.log(err);
      });
  };



  return (
    <form onSubmit={createVehicleHandler}>
      {props.activeBranch}
      <Input
        id="brand"
        label="Brand"
        type="text"
        control="input"
        onChange={(e) => {
          setVehicleData({ ...vehicleData, brand: e.target.value });
        }}
      />
      <Input
        id="model"
        label="Model"
        type="text"
        control="input"
        onChange={(e) => {
          setVehicleData({ ...vehicleData, model: e.target.value });
        }}
      />
      <Input
        id="year"
        label="Year"
        type="number"
        control="input"
        onChange={(e) => {
          setVehicleData({ ...vehicleData, year: e.target.value });
        }}
      />
      <Input
        id="registrationPlate"
        label="Registration Plate"
        type="text"
        control="input"
        onChange={(e) => {
          setVehicleData({ ...vehicleData, registrationPlate: e.target.value });
        }}
      />
      <div>
          <div className={classes.categories}>{categoriesOptions}</div>
      </div>
      <div className={classes.btndiv}>
        <Button type="submit">Add Vehicle to Branch</Button>
      </div>
    </form>
  );
};

export default CreateVehicle;
