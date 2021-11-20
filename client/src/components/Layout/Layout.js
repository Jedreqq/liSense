import { Fragment } from "react";
import classes from "./Layout.module.css";
import MainNav from "../MainNav/MainNav";

const Layout = (props) => {
  return (
    <Fragment>
      <MainNav />
      <main className={classes.main}>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
