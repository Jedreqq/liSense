import { useEffect, useState } from "react";
import Payment from "../../components/Payment/Payment";
import classes from './Payments.module.css'

const Payments = (props) => {
  const [payments, setPayments] = useState({
    payments: [],
  });

  useEffect(() => {
    fetch("http://localhost:3001/branchPaymentsList", {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.payments);
        setPayments((paymentsInfo) => ({
          ...paymentsInfo,
          payments: resData.payments.map((payment) => {
            return {
              ...payment,
            };
          }),
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.loginStatus.token]);

  return (
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
    </div>
  );
};

export default Payments;
