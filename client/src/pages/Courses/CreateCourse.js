import { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import classes from "./Courses.module.css";
// const name = req.body.name;
// const price = req.body.price;
// const dayOfStart = req.body.dayOfStart;
// const theoryClasses = req.body.theoryClasses;
// const practicalClasses = req.body.practicalClasses;
// const categories = req.body.categories;
const CreateCourse = (props) => {
  const [courseData, setCourseData] = useState({
    name: "",
    price: "",
    dayOfStart: "",
    theoryClasses: "",
    practicalClasses: "",
    categories: [],
  });
  console.log(courseData);
  const checkCategoriesHandler = (e) => {
    let categoriesList = courseData.categories;
    let isChecked = e.target.checked;
    let checkedCategory = e.target.value;
    if (isChecked) {
      setCourseData((prevState) => ({
        ...prevState,
        categories: [...prevState.categories.concat(checkedCategory)],
      }));
    } else {
      var index = categoriesList.indexOf(checkedCategory);
      if (index > -1) {
        setCourseData((prevState) => ({
          ...prevState,
          categories: [
            ...prevState.categories.filter(
              (element) => element !== categoriesList[index]
            ),
          ],
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

  const createCourseHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/createCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        name: courseData.name,
        price: courseData.price,
        dayOfStart: courseData.dayOfStart,
        practicalClasses: courseData.practicalClasses,
        theoryClasses: courseData.theoryClasses,
        categories: courseData.categories,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a course failed!");
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
    <form onSubmit={createCourseHandler}>
      {props.activeBranch}
      <Input
        id="name"
        label="Name"
        type="text"
        control="input"
        onChange={(e) => {
          setCourseData({ ...courseData, name: e.target.value });
        }}
      />
      <Input
        id="price"
        label="Price"
        type="number"
        control="input"
        onChange={(e) => {
          setCourseData({ ...courseData, price: e.target.value });
        }}
      />
      <Input
        id="dayOfStart"
        label="Day Of Start"
        type="date"
        control="input"
        onChange={(e) => {
          setCourseData({ ...courseData, dayOfStart: e.target.value });
        }}
      />
      <Input
        id="theoryClasses"
        label="Theory Classes"
        type="number"
        control="input"
        onChange={(e) => {
          setCourseData({ ...courseData, theoryClasses: e.target.value });
        }}
      />
      <Input
        id="practicalClasses"
        label="Practical Classes"
        type="number"
        control="input"
        onChange={(e) => {
          setCourseData({ ...courseData, practicalClasses: e.target.value });
        }}
      />
      <div>
        <div className={classes.categories}>{categoriesOptions}</div>
      </div>
      <div className={classes.btndiv}>
        <Button type="submit">Add New Course</Button>
      </div>
    </form>
  );
};

export default CreateCourse;
