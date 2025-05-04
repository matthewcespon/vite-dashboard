import classes from './Loader.module.css';

const Loader: React.FC = () => {
  return (
    <div className={classes.loaderContainer}>
      <div className={classes.loader}></div>
    </div>
  );
}

export default Loader;