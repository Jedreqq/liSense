import { useEffect, useState } from "react";

const School = props => {
    const [schoolDetails, setSchoolDetails] = useState({
        schoolName: "",
        schoolOwner: ""
    });



    useEffect(() => {
        fetch("http://localhost:3001/school", {
            headers: {
                Authorization: 'Bearer ' + props.loginStatus.token
            }
        }).then(res => {
            if(res.status !== 200) {
                throw new Error("Failed to fetch owner's school.");
            }
            return res.json();
        }).then(resData => {
            console.log(resData)
            setSchoolDetails({
                schoolName: resData.schoolName,
                schoolOwner: resData.schoolOwner
            });
        }).catch(err => {
            console.log(err);
        })
    }, [props.loginStatus.token])

 return <div>
     <p>Welcome {schoolDetails.schoolOwner}</p>
     <hr/>
     <p>Your School: {schoolDetails.schoolName}</p>
     
 </div>
}

export default School;