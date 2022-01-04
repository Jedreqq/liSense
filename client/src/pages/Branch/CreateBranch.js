import { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import classes from './Branches.module.css';

const CreateBranch = props => {
    const [branchData, setBranchData] = useState({
        name: "",
        city: "",
        postalCode: "",
        phoneNumber: "",
        address: "",
      });

      
    const createBranchHandler = (e) => {
        e.preventDefault();
        fetch("http://localhost:3001/branch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.loginStatus.token,
          },
          body: JSON.stringify({
            name: branchData.name,
            city: branchData.city,
            postalCode: branchData.postalCode,
            phoneNumber: branchData.phoneNumber,
            address: branchData.address,
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
            window.location.reload()
          })
          .catch((err) => console.log(err));
      };
    return (
        <form onSubmit={createBranchHandler}>
        <Input
          id="name"
          label="Name"
          type="text"
          control="input"
          onChange={(e) => {
            setBranchData({ ...branchData, name: e.target.value });
          }}
        />
        <Input
          id="city"
          label="City"
          type="text"
          control="input"
          onChange={(e) => {
            setBranchData({ ...branchData, city: e.target.value });
          }}
        />
        <Input
          id="postalCode"
          label="Postal Code"
          type="text"
          control="input"
          onChange={(e) => {
            setBranchData({ ...branchData, postalCode: e.target.value });
          }}
        />
        <Input
          id="phoneNumber"
          label="Phone Number"
          type="number"
          control="input"
          onChange={(e) => {
            setBranchData({ ...branchData, phoneNumber: e.target.value });
          }}
        />
        <Input
          id="address"
          label="Address"
          type="text"
          control="input"
          onChange={(e) => {
            setBranchData({ ...branchData, address: e.target.value });
          }}
        />
        <div className={classes.btndiv}>
          <Button type="submit">Create Branch</Button>
        </div>
      </form>
    )
}

export default CreateBranch;