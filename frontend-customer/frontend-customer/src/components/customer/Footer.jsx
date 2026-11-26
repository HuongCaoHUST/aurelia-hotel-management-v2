export default function Footer() {
  return (
  <footer className="text-light section-dark">
    <div className="container">
      <div className="row g-4 align-items-center">
        <div className="col-md-12">
          <div className="d-lg-flex align-items-center justify-content-between text-center">
            <div>
              <h3 className="fs-20">
                {"Address"}
              </h3>
              {" 742 Evergreen Terrace"}
              <br />
              {" Brooklyn, NY 11201 "}
            </div>
            <div>
              <img src="/images/aurelia-logo-white.webp" className="w-200px" alt="" />
              <br />
              <div className="social-icons mb-sm-30 mt-4">
                <a href="#">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="fs-20">
                {"Contact Us"}
              </h3>
              {" T. +929 333 9296"}
              <br />
              {" M. contact@Aurelia.com "}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="subfooter">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            {" This website is created for the course "}
            <strong>
              {"Web and Mobile Applications Programming (ET4711)"}
            </strong>
            {"."}
            <br />
            <em>
              {"Not for commercial purposes."}
            </em>
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
}
