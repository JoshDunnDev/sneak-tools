const ErrorBox = ({error}) => {
  return (
    <div className="mt-4">
      <div className="mx-auto pb-3 errorBox">
        <div className="row justify-content-between mx-3">
          <div className="col-12 col-sm-7 d-flex align-items-center mt-3">
            {error}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ErrorBox;
