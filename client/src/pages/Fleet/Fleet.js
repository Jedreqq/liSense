import { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import Loader from "../../components/Loader/Loader";
import Vehicle from "../../components/Vehicle/Vehicle";
import CreateVehicle from "./CreateVehicle";
import classes from "./Fleet.module.css";

const Fleet = (props) => {
  const [vehicles, setVehicles] = useState({
    vehicles: [],
  });

  const [isAdded, setIsAdded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const vehiclesPerPage = 5;
  const pagesVisited = pageNumber * vehiclesPerPage;

  const showVehicles = vehicles.vehicles
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(pagesVisited, pagesVisited + vehiclesPerPage)
    .map((vehicle) => {
      return (
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
      );
    });

  const pageCount = Math.ceil(vehicles.vehicles.length / vehiclesPerPage);
  const changeCurrentPage = ({ selected }) => {
    setPageNumber(selected);
  };

  const [showCreateVehicleCart, setShowCreateVehicleCart] = useState(false);

  const loadVehicles = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/fleet", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch vehicles.");
      }
      const resData = await res.json();

      setVehicles((vehiclesInfo) => ({
        ...vehiclesInfo,
        vehicles: resData.vehicles.map((vehicle) => {
          return {
            ...vehicle,
          };
        }),
      }));
      setIsAdded(false);
    } catch (err) {
      console.log(err);
    }
  }, [props.loginStatus.token]);

  useEffect(
    () => loadVehicles().finally((x) => setIsLoaded(true)),
    [loadVehicles, setIsLoaded, props.loginStatus.token, isAdded]
  );

  const showCreateVehicleCartHandler = (e) => {
    e.preventDefault();
    setShowCreateVehicleCart((prevState) => !prevState);
  };

  const updateVehicles = (e) => {
    e.preventDefault();
    setIsAdded(true);
  };

  let buttonContent = "Show Vehicle Creator";

  if (showCreateVehicleCart) {
    buttonContent = "Hide Vehicle Creator";
  }

  return isLoaded ? (
    <div>
      <div className={classes.vehiclesDiv}>
        <button onClick={showCreateVehicleCartHandler}>{buttonContent}</button>
        {showCreateVehicleCart && (
          <CreateVehicle
            onCreateVehicle={updateVehicles}
            loginStatus={props.loginStatus}
            activeBranch={props.activeBranch}
          />
        )}
        <h2>Vehicles in branch</h2>
        {vehicles.vehicles.length === 0 && <p>No vehicles in branch.</p>}
        {vehicles.vehicles.length > 0 && (
          <table className={classes.table}>
            <tbody>
              <tr>
                <th>Model</th>
                <th>Brand</th>
                <th>Year</th>
                <th>Registration Plate</th>
                <th>Categories</th>
                <th>Actions</th>
              </tr>
              {showVehicles}
            </tbody>
          </table>
        )}
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changeCurrentPage}
        containerClassName={classes.pagination}
        previousLinkClassName={classes.previousBtn}
        nextLinkClassName={classes.nextBtn}
        disabledClassName={classes.paginationDisabled}
        activeClassName={classes.activePagination}
      />
    </div>
  ) : (
    <div className={classes.centered}>
      <Loader />
    </div>
  );
};

export default Fleet;
