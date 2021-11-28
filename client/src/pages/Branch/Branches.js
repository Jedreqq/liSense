import { useEffect, useState } from "react";
import Branch from "../../components/Branch/Branch";
import classes from "./Branches.module.css";
import CreateBranch from "./CreateBranch";

const Branches = (props) => {
  const [branchesInfo, setBranchesInfo] = useState({
    branches: [],
  });

  const [showCreateBranchCart, setShowCreateBranchCart] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/ownerBranches", {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch branches.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.branches);
        setBranchesInfo((branchesInfo) => ({
          ...branchesInfo,
          branches: resData.branches.map((branch) => {
            return {
              ...branch,
            };
          }),
        }));
      })
      .catch((err) => console.log(err));
  }, [props.loginStatus.token]);

  const showCreateBranchCartHandler = (e) => {
    e.preventDefault();
    setShowCreateBranchCart((prevState) => !prevState);
  };

  let buttonContent = "Show Branch Creator";

  if (showCreateBranchCart) {
    buttonContent = "Hide Branch Creator";
  }

  return (
    <div className={classes.branchDiv}>
      <button onClick={showCreateBranchCartHandler}>{buttonContent}</button>
      {showCreateBranchCart && <CreateBranch loginStatus={props.loginStatus} />}
      {branchesInfo.branches.length === 0 && (
        <div>
          <p>No branches found.</p>
          <br />
        </div>
      )}
      {branchesInfo.branches.length > 0 &&
        branchesInfo.branches.map((branch) => (
          <Branch
            loginStatus={props.loginStatus}
            onActiveBranchChange={(e) =>
              props.onActiveBranchChange(e, branch._id)
            }
            key={branch._id}
            id={branch._id}
            name={branch.name}
            city={branch.city}
            postalCode={branch.postalCode}
            address={branch.address}
            phoneNumber={branch.phoneNumber}
          />
        ))}
    </div>
  );
};

export default Branches;
