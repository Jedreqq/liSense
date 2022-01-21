import React, { useCallback, useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import Payment from "../../components/Payment/Payment";
import classes from "./Payments.module.css";
import ReactPaginate from 'react-paginate';

const Payments = (props) => {
  const [payments, setPayments] = useState({
    payments: [],
  });

  const [isChanged, setIsChanged] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const paymentsPerPage = 10;
  const pagesVisited = pageNumber * paymentsPerPage;

  const loadPayments = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/branchPaymentsList", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch status");
      }
      const resData = await res.json();
      setPayments((paymentsInfo) => ({
        ...paymentsInfo,
        payments: resData.payments.map((payment) => {
          return {
            ...payment,
          };
        }),
      }));
      setIsChanged(false);
    } catch (err) {
      console.log(err);
    }
  }, [props.loginStatus.token]);

  useEffect(
    () => loadPayments().finally((x) => setIsLoaded(true)),
    [loadPayments, setIsLoaded, props.loginStatus.token, isChanged]
  );

  const changePayment = (e, resData) => {
    e.preventDefault();
    setIsChanged(true);
  };

  const pageCount = Math.ceil(payments.payments.length / paymentsPerPage);
  const changeCurrentPage = ({selected}) => {
    setPageNumber(selected)
  }

  const showPayments = payments.payments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(pagesVisited, pagesVisited + paymentsPerPage).map((payment) => (
    <Payment
      onChanged={changePayment}
      loginStatus={props.loginStatus}
      key={payment._id}
      id={payment._id}
      courseName={payment.name}
      price={payment.price}
      status={payment.status}
      statusUpdateDate={payment.updatedAt}
      user={payment.user}
    />
  ));

  return isLoaded ?
    <div>
      <h2>Payments in branch</h2>
      {payments.payments.length === 0 && <p>No payments in branch.</p>}
      {payments.payments.length > 0 && (
        <React.Fragment>

        <table className={classes.table}>
          <tbody>
            <tr>
              <th>User</th>
              <th>Course Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
            {showPayments}
            {/* {payments.payments.map((payment) => (
              <Payment
              onChanged={changePayment}
              loginStatus={props.loginStatus}
              key={payment._id}
              id={payment._id}
              courseName={payment.name}
              price={payment.price}
              status={payment.status}
              statusUpdateDate={payment.updatedAt}
              user={payment.user}
              />
            ))} */}
          </tbody>
        </table>
        <ReactPaginate previousLabel={"Previous"} nextLabel={"Next"} pageCount={pageCount} onPageChange={changeCurrentPage} containerClassName={classes.pagination} previousLinkClassName={classes.previousBtn} nextLinkClassName={classes.nextBtn} disabledClassName={classes.paginationDisabled} activeClassName={classes.activePagination} />
      </React.Fragment>
      )}
    </div> : <div className={classes.centered}> <Loader /> </div>
};

export default Payments;
