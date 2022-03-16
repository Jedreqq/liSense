import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import classes from "./Dashboard.module.css";
import Branch from "../../components/Branch/Branch";
import Loader from "../../components/Loader/Loader";
import ReactPaginate from "react-paginate";

const Dashboard = (props) => {
  const [role, setRole] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [hasCreatedSchool, setHasCreatedSchool] = useState(false); //if school created by owner he gets redirected to his school
  const [isMember, setIsMember] = useState(false);
  const [allBranches, setAllBranches] = useState([]);
  const [BranchRequestId, setBranchRequestId] = useState(null);
  const navigate = useNavigate();


  const [isLoaded, setIsLoaded] = useState(false);

  const onBranchRequestIdChange = (e, id) => {
    e.preventDefault();
    setBranchRequestId(id);
  }

  const [pageNumber, setPageNumber] = useState(0);
  const branchesPerPage = 5;
  const pagesVisited = pageNumber * branchesPerPage;

  const showBranches = allBranches
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(pagesVisited, pagesVisited + branchesPerPage)
    .map((branch) => {
      return (
        <Branch
        onBranchRequestIdChange={onBranchRequestIdChange}
        BranchRequestId={BranchRequestId}
          loginStatus={props.loginStatus}
          key={branch._id}
          id={branch._id}
          name={branch.name}
          city={branch.city}
          postalCode={branch.postalCode}
          address={branch.address}
          phoneNumber={branch.phoneNumber}
        />
      );
    });

    const pageCount = Math.ceil(allBranches.length / branchesPerPage);
    const changeCurrentPage = ({ selected }) => {
      setPageNumber(selected);
    };

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/dashboard", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch user status.");
      }
      const resData = await res.json();
      setRole(resData.role);
      setHasCreatedSchool(resData.hasSchool);
      if (role === "owner" && hasCreatedSchool) {
        navigate("/school");
      }
      if (role === "student" || role === "instructor") {
        setIsMember(!!resData.memberId);
        if(resData.memberId !== null) {
          localStorage.setItem('memberId', resData.memberId)
        } 
      }
      if (role === "student" && isMember) {
        navigate("/studentDash");
      }
    } catch (err) {
      console.log(err);
    }

    if (
      props.loginStatus.userRole === "student" ||
      props.loginStatus.userRole === "instructor"
    ) {
      try {
        const res = await fetch("http://localhost:3001/branchesList", {
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
          },
        })
 
            if (res.status !== 200) {
              throw new Error("Failed to fetch branches.");
            }
            const resData = await res.json();

            setAllBranches(
              resData.branches.map((branch) => {
                return {
                  ...branch,
                };
              })
            );
            setBranchRequestId(resData.BranchRequestId);
      } catch (err) {
        console.log(err);
      }
    }
  }, [hasCreatedSchool, isMember, navigate, role, props.loginStatus]);

  useEffect(
    () => loadDashboard().finally((x) => setIsLoaded(true)),
    [
      setIsLoaded,
      loadDashboard,
      props.loginStatus.token,
      hasCreatedSchool,
      navigate,
      role,
      isMember,
    ]
  );

  const createSchoolHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/createSchool", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        name: schoolName,
      }),
    })
      .then((res) => {
        if ((res.status !== 200) & (res.status !== 201)) {
          console.log("Error!");
          throw new Error("Creating new school failed.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      });
  };



  let isStudent = role === "student";
  let isInstructor = role === "instructor";
  let isOwner = role === "owner";


  return isLoaded ?
    <div>
      <p>Hello there, authenticated man, are you a {role}? </p>
      {(isStudent || isInstructor) && !isMember && (
        <React.Fragment>

        <div className={classes.branchDiv}>
          <p>
            Great! Let's find your driving school, you need to enter a city or
            school name...
          </p>
          {allBranches.length === 0 && <p>Found 0 schools total.</p>}
          {allBranches.length > 0 &&
            (
              <table className={classes.table}>
            <tbody>
              <tr>
                <th>Branch</th>
                <th>Address</th>
                <th>City</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
              {showBranches}
            </tbody>
          </table>
            )}
        </div>
        <ReactPaginate previousLabel={"Previous"} nextLabel={"Next"} pageCount={pageCount} onPageChange={changeCurrentPage} containerClassName={classes.pagination} previousLinkClassName={classes.previousBtn} nextLinkClassName={classes.nextBtn} disabledClassName={classes.paginationDisabled} activeClassName={classes.activePagination} />
        </React.Fragment>
      )}
      {isOwner && !hasCreatedSchool && (
        <div>
          <p>
            Great! Let's create your group by entering the general information
            about your driving school...
          </p>
          <form
            onSubmit={createSchoolHandler}
            className={classes.createSchoolForm}
          >
            <Input
              id="schoolname"
              label="Driving School Name"
              type="text"
              control="input"
              onChange={(e) => {
                setSchoolName(e.target.value);
              }}
            />
            <div className={classes.btndiv}>
              <Button type="submit">Create School</Button>
            </div>
          </form>
        </div>
      )}
    </div> : <div className={classes.centered}>
      <Loader />
    </div>
};

export default Dashboard;
