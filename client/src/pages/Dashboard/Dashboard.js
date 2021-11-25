import React, { useEffect, useState } from "react";

const Dashboard = (props) => {
    const [role, setRole] = useState('');
    useEffect(() => {
        fetch('http://localhost:3001/user/dashboard', {
            headers: {
                Authorization: 'Bearer ' + props.loginStatus.token
            }
        }).then(res => {
            if (res.status !== 200) {
              throw new Error('Failed to fetch user status.');
            }
            return res.json();
          })
          .then(resData => {
            setRole(resData.role);
          })
    }, [props.loginStatus.token]);

  return <div>Hello there, authenticated man, are you a {role}? <button onClick={props.onLogout}>Try to logout</button></div>;
};

export default Dashboard;
