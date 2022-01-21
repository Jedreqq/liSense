import React, { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Branch from "../../components/Branch/Branch";
import Loader from "../../components/Loader/Loader";
import classes from "./Branches.module.css";
import CreateBranch from "./CreateBranch";

const Branches = (props) => {
  const [branchesInfo, setBranchesInfo] = useState({
    branches: [],
  });

  const [showCreateBranchCart, setShowCreateBranchCart] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const activeBranch = props.activeBranch;


  const showCreateBranchCartHandler = (e) => {
    e.preventDefault();
    setShowCreateBranchCart((prevState) => !prevState);
  };

  const updateBranches = (e, resData) => {
    e.preventDefault();
    setIsAdded(true);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const branchesPerPage = 3;
  const pagesVisited = pageNumber * branchesPerPage;

  const showBranches = branchesInfo.branches
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(pagesVisited, pagesVisited + branchesPerPage)
    .map((branch) => {
      return (
        <Branch
          activeBranch={activeBranch}
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
      );
    });

  const pageCount = Math.ceil(branchesInfo.branches.length / branchesPerPage);
  const changeCurrentPage = ({ selected }) => {
    setPageNumber(selected);
  };


  const loadBranches = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/ownerBranches", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch branches.");
      }
      const resData = await res.json();

      setBranchesInfo((branchesInfo) => ({
        ...branchesInfo,
        branches: resData.branches.map((branch) => {
          return {
            ...branch,
          };
        }),
      }));

      setIsAdded(false);
    } catch (err) {
      console.log(err);
    }
  }, [props.loginStatus.token]);

  useEffect(
    () => loadBranches().finally((x) => setIsLoaded(true)),
    [loadBranches, setIsLoaded, props.loginStatus.token, isAdded]
  );

  let buttonContent = "Show Branch Creator";

  if (showCreateBranchCart) {
    buttonContent = "Hide Branch Creator";
  }

  return isLoaded ? (
    <React.Fragment>

    <div className={classes.branchDiv}>
      <button onClick={showCreateBranchCartHandler}>{buttonContent}</button>
      {showCreateBranchCart && (
        <CreateBranch
        onCreateBranch={updateBranches}
        loginStatus={props.loginStatus}
        />
        )}
      {branchesInfo.branches.length === 0 && (
        <div>
          <p>No branches found.</p>
          <br />
        </div>
      )}
      {branchesInfo.branches.length > 0 && showBranches}
    </div>
    <ReactPaginate previousLabel={"Previous"} nextLabel={"Next"} pageCount={pageCount} onPageChange={changeCurrentPage} containerClassName={classes.pagination} previousLinkClassName={classes.previousBtn} nextLinkClassName={classes.nextBtn} disabledClassName={classes.paginationDisabled} activeClassName={classes.activePagination} />
      </React.Fragment>
  ) : (
    <div className={classes.centered}>
      {" "}
      <Loader />{" "}
    </div>
  );
};

export default Branches;
