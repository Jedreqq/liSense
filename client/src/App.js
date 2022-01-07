import { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
//import Button from "./components/Button/Button";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import HomePage from "./pages/Auth/HomePage";
import { useNavigate } from "react-router-dom";
import School from "./components/School/School";
import Branches from "./pages/Branch/Branches";
import Students from "./pages/Students/Students";
import Instructors from "./pages/Instructors/Instructors";
import Fleet from "./pages/Fleet/Fleet";
import Payments from "./pages/Payments/Payments";
import Schedule from "./pages/Schedule/Schedule";
import Courses from "./pages/Courses/Courses";
import SingleCourse from "./pages/Courses/SingleCourse/SingleCourse";
import StudentDash from "./pages/Dashboard/StudentDash/StudentDash";
import Payment from "./pages/Payment/Payment";
import SingleVehicle from "./pages/Fleet/SingleVehicle/SingleVehicle";
import SingleInstructor from "./pages/Instructors/SingleInstructor/SingleInstructor";
import SingleStudent from "./pages/Students/SingleStudent/SingleStudent";
import InstructorDash from "./pages/Dashboard/InstructorDash/InstructorDash";

function App() {
  const [loginStatus, setLoginStatus] = useState({
    isAuth: false,
    token: null,
    userId: null,
    userRole: null,
    userMail: null,
  });

  const [activeBranch, setActiveBranch] = useState(null);
  const [memberId, setMemberId] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  const logoutHandler = useCallback(() => {
    setLoginStatus({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expireDate");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("activeBranch");
    localStorage.removeItem("memberId");
    localStorage.removeItem("userMail");
    setActiveBranch(null);
    setMemberId(null);
  }, [setLoginStatus, setActiveBranch, setMemberId]);

  const checkLoginStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    const expireDate = localStorage.getItem("expireDate");
    if (!token || !expireDate) {
      return;
    }
    if (new Date(expireDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const userId = localStorage.getItem("userId");
    const userMail = localStorage.getItem("userMail");
    const userRole = localStorage.getItem("userRole");
    const activeBranch = localStorage.getItem("activeBranch");
    const memberId = localStorage.getItem("memberId");
    // const remainingTime = new Date(expireDate).getTime() - new Date().getTime();
    setLoginStatus((loginStatus) => ({
      ...loginStatus,
      isAuth: true,
      token: token,
      userId: userId,
      userRole: userRole,
      userMail: userMail,
    })); //use setState(state => ({...state,,,})) for preventing the useeffect setstate inf loop
    if (userRole === "owner") {
      setActiveBranch(activeBranch);
    }
    setMemberId(memberId);
  }, [logoutHandler, setLoginStatus, setActiveBranch]);

  useEffect(
    () => checkLoginStatus().finally((x) => setIsLoaded(true)),
    [loginStatus.isAuth, checkLoginStatus, setIsLoaded]
  );

  console.log(memberId);

  const activeBranchHandler = (e, activeBranch) => {
    e.preventDefault();
    setActiveBranch(activeBranch);
    localStorage.setItem("activeBranch", activeBranch);
    fetch("http://localhost:3001/sendActiveBranch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + loginStatus.token,
      },
      body: JSON.stringify({
        activeBranchId: activeBranch,
      }),
    });
    console.log("Changed.");
  };

  const signupHandler = (e, signupData) => {
    e.preventDefault();
    console.log("Trying to sign up.");
    fetch("http://localhost:3001/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: signupData.role,
        email: signupData.email,
        password: signupData.password,
        firstname: signupData.firstname,
        lastname: signupData.lastname,
        usercity: signupData.usercity,
        postalcode: signupData.postalcode,
        phonenumber: signupData.phonenumber,
        confirmpassword: signupData.confirmpassword,
        categories: signupData.categories,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a user failed!");
        }
        return res.json();
      })
      .then((resData) => {
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const loginHandler = (e, loginData) => {
    e.preventDefault();
    console.log("Trying to log in.");
    fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setLoginStatus({
          ...loginStatus,
          isAuth: true,
          token: resData.token,
          userId: resData.userId,
          userRole: resData.role,
          userMail: resData.email,
        });
        setMemberId(resData.memberId);

        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        localStorage.setItem("userRole", resData.role);
        localStorage.setItem("memberId", resData.memberId);
        localStorage.setItem("userMail", resData.email);
        const remainingTime = 60 * 60 * 1000;
        const expireDate = new Date(new Date().getTime() + remainingTime);
        localStorage.setItem("expireDate", expireDate.toISOString());
      })
      .catch((err) => {
        console.log(err);
        setLoginStatus({ ...loginStatus, isAuth: false });
      });
  };

  let routes;
  if (!loginStatus.isAuth) {
    routes = (
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/login"
          element={<LoginPage onLogin={loginHandler} />}
        ></Route>
        <Route
          path="/signup"
          element={<SignupPage onSignup={signupHandler} />}
        ></Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  }
  if (loginStatus.isAuth && loginStatus.userRole === "owner") {
    routes = (
      <Routes>
        <Route path="/school" element={<School loginStatus={loginStatus} />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard loginStatus={loginStatus} onLogout={logoutHandler} />
          }
        />

        <Route
          path="/branches"
          element={
            <Branches
              onActiveBranchChange={activeBranchHandler}
              loginStatus={loginStatus}
            />
          }
        />
        <Route
          path="/students"
          element={
            <Students loginStatus={loginStatus} activeBranch={activeBranch} />
          }
        />
        <Route
          path="/students/:studentId"
          element={
            <SingleStudent
              loginStatus={loginStatus}
              activeBranch={activeBranch}
            />
          }
        />
        <Route
          path="/instructors"
          element={
            <Instructors
              loginStatus={loginStatus}
              activeBranch={activeBranch}
            />
          }
        />
        <Route
          path="/instructors/:instructorId"
          element={
            <SingleInstructor
              loginStatus={loginStatus}
              activeBranch={activeBranch}
            />
          }
        />
        <Route
          path="/fleet"
          element={
            <Fleet loginStatus={loginStatus} activeBranch={activeBranch} />
          }
        />
        <Route
          path="/fleet/:vehicleId"
          element={
            <SingleVehicle
              loginStatus={loginStatus}
              activeBranch={activeBranch}
            />
          }
        />
        <Route
          path="/payments"
          element={
            <Payments loginStatus={loginStatus} activeBranch={activeBranch} />
          }
        />
        <Route
          path="/schedule"
          element={
            <Schedule loginStatus={loginStatus} activeBranch={activeBranch} />
          }
        />
        <Route
          path="/courses"
          element={
            <Courses loginStatus={loginStatus} activeBranch={activeBranch} />
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <SingleCourse
              loginStatus={loginStatus}
              activeBranch={activeBranch}
            />
          }
        />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    );
  }
  if (
    loginStatus.isAuth &&
    memberId === null &&
    (loginStatus.userRole === "student" ||
      loginStatus.userRole === "instructor")
  ) {
    routes = (
      <Routes>
        <Route
          path="/dashboard"
          exact
          element={
            <Dashboard loginStatus={loginStatus} onLogout={logoutHandler} />
          }
        />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    );
  }
  if (
    loginStatus.isAuth &&
    loginStatus.userRole === "instructor" &&
    memberId !== null
  ) {
    routes = (
      <Routes>
        <Route
          path="/instructorDash"
          exact
          element={
            <InstructorDash
              loginStatus={loginStatus}
              onLogout={logoutHandler}
            />
          }
        />
        <Route
          path="/students"
          exact
          element={
            <Students loginStatus={loginStatus} onLogout={logoutHandler} />
          }
        />
        <Route
          path="/schedule"
          exact
          element={
            <Schedule loginStatus={loginStatus} onLogout={logoutHandler} />
          }
        />
        <Route path="*" element={<Navigate replace to="/instructorDash" />} />
      </Routes>
    );
  }

  if (
    loginStatus.isAuth &&
    loginStatus.userRole === "student" &&
    memberId !== null
  ) {
    routes = (
      <Routes>
        <Route
          path="/payment"
          exact
          element={<Payment loginStatus={loginStatus} />}
        />
        <Route
          path="/instructors"
          exact
          element={
            <Instructors
              loginStatus={loginStatus}
              activeBranch={activeBranch}
              memberId={memberId}
            />
          }
        />
        <Route
          path="/courses"
          exact
          element={
            <Courses
              loginStatus={loginStatus}
              activeBranch={activeBranch}
              memberId={memberId}
            />
          }
        />
        <Route
          path="/studentDash"
          exact
          element={
            <StudentDash loginStatus={loginStatus} onLogout={logoutHandler} />
          }
        />
        <Route path="*" element={<Navigate replace to="/studentDash" />} />
      </Routes>
    );
  }
  return isLoaded ? (
    <Layout
      onLogout={logoutHandler}
      loginStatus={loginStatus}
      memberId={memberId}
    >
      {routes}
    </Layout>
  ) : (
    <></>
  );
}

export default App;
