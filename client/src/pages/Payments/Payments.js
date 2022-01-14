import { useCallback, useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import Payment from "../../components/Payment/Payment";
import classes from "./Payments.module.css";

const Payments = (props) => {
  const [payments, setPayments] = useState({
    payments: [],
  });

  const [isChanged, setIsChanged] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  return isLoaded ?
    <div>
      <h2>Payments in branch</h2>
      {payments.payments.length === 0 && <p>No payments in branch.</p>}
      {payments.payments.length > 0 && (
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
            {payments.payments.map((payment) => (
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
            ))}
          </tbody>
        </table>
      )}
    </div> : <div className={classes.centered}> <Loader /> </div>
};

export default Payments;
