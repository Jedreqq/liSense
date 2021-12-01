import classes from './Student.module.css';

const Student = props => {

    return (
        <article className={classes.singleBranch}>
          <div>
            <header>
              <h2>
                {` ${props.name}, ${props.address}, ${props.postalCode} ${props.city}`}
              </h2>
              <p>{props.phoneNumber}</p>
            </header>
          </div>
        </article>
      );
}

export default Student;