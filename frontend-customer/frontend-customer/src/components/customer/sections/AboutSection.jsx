export default function AboutSection() {
  return (
  <section id="section-about" className="relative">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4 sm-hide">
          <div className="relative wow fadeInUp" data-wow-delay=".3s">
            <div className="abs top-0 w-100">
              <div className="shape-mask-1 jarallax">
                <img src="/images/misc/2.webp" className="jarallax-img" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 text-center">
          <div className="wow scaleIn">
            <div className="subtitle id-color mb-3">
              {"Welcome To Aurelia"}
            </div>
            <h2 className="wow fadeInUp">
              {"Exceptional Hospitality and Unmatched Relaxation at Aurelia"}
            </h2>
            <div className="text-center wow fadeInUp" data-wow-delay=".5s">
              <h4 className="fw-bold mb-1">
                {"4.9 out of 5"}
              </h4>
              <div className="de-rating-ext fs-18">
                <span className="d-stars">
                  <i className="icofont-star"></i>
                  <i className="icofont-star"></i>
                  <i className="icofont-star"></i>
                  <i className="icofont-star"></i>
                  <i className="icofont-star"></i>
                </span>
              </div>
              <span className="d-block fs-14 mb-0">
                {"Based on 25000+ reviews"}
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-4 sm-hide">
          <div className="relative wow fadeInUp" data-wow-delay=".3s">
            <div className="abs top-0 w-100">
              <div className="shape-mask-1 jarallax">
                <img src="/images/misc/3.webp" className="jarallax-img" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="spacer-double"></div>
      <div className="row g-4 relative z-2">
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".3s">
          <div className="relative p-4 bg-white border-grey">
            <span className="abs top-= w-70px p-3 rounded-up-100 bg-color d-block">
              <img src="/images/svg/restaurant-svgrepo-com.svg" className="w-100" alt="" />
            </span>
            <div className="pl-90">
              <h4>
                {"Restaurant"}
              </h4>
              <p className="mb-0">
                {"Do dolore laboris commodo amet cillum qui voluptate velit occaecat adipisicing laboris est minim."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".4s">
          <div className="relative p-4 bg-white border-grey">
            <span className="abs top-= w-70px p-3 rounded-up-100 bg-color d-block">
              <img src="/images/svg/swimming-pool-svgrepo-com.svg" className="w-100" alt="" />
            </span>
            <div className="pl-90">
              <h4>
                {"Swimming Pool"}
              </h4>
              <p className="mb-0">
                {"Do dolore laboris commodo amet cillum qui voluptate velit occaecat adipisicing laboris est minim."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".5s">
          <div className="relative p-4 bg-white border-grey">
            <span className="abs top-= w-70px p-3 rounded-up-100 bg-color d-block">
              <img src="/images/svg/fitness-gym-svgrepo-com.svg" className="w-100" alt="" />
            </span>
            <div className="pl-90">
              <h4>
                {"Fitness Center"}
              </h4>
              <p className="mb-0">
                {"Do dolore laboris commodo amet cillum qui voluptate velit occaecat adipisicing laboris est minim."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
          <div className="relative p-4 bg-white border-grey">
            <span className="abs top-= w-70px p-3 rounded-up-100 bg-color d-block">
              <img src="/images/svg/flower-lotus-thin-svgrepo-com.svg" className="w-100" alt="" />
            </span>
            <div className="pl-90">
              <h4>
                {"Spa & Massage"}
              </h4>
              <p className="mb-0">
                {"Do dolore laboris commodo amet cillum qui voluptate velit occaecat adipisicing laboris est minim."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".7s">
          <div className="relative p-4 bg-white border-grey">
            <span className="abs top-= w-70px p-3 rounded-up-100 bg-color d-block">
              <img src="/images/svg/meeting-explain-svgrepo-com.svg" className="w-100" alt="" />
            </span>
            <div className="pl-90">
              <h4>
                {"Meeting Room"}
              </h4>
              <p className="mb-0">
                {"Do dolore laboris commodo amet cillum qui voluptate velit occaecat adipisicing laboris est minim."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".8s">
          <div className="relative p-4 bg-white border-grey">
            <span className="abs top-= w-70px p-3 rounded-up-100 bg-color d-block">
              <img src="/images/svg/laundry-machine-svgrepo-com.svg" className="w-100" alt="" />
            </span>
            <div className="pl-90">
              <h4>
                {"Laundry Service"}
              </h4>
              <p className="mb-0">
                {"Do dolore laboris commodo amet cillum qui voluptate velit occaecat adipisicing laboris est minim."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
