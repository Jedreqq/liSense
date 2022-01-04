import React from "react";

const HomePage = (props) => {
const addCategoriesHandler = e => {
  e.preventDefault();
  fetch("http://localhost:3001/addCategory", {
    method: "POST"
  })
}
  
  return <p>Welcome to driving school management web app. 
    <button onClick={addCategoriesHandler}>Add Categories</button>
    </p>;

};

export default HomePage;
