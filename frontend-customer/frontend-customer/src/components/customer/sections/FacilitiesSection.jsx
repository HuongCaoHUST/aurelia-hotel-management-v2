export default function FacilitiesSection() {
  return (
  <section id="section-facilities" className="relative bg-light">
    <div className="container-fluid relative z-2">
      <div className="row g-4">
        <div className="col-lg-8 offset-lg-2 text-center">
          <div className="subtitle id-color wow fadeInUp mb-3">
            {"Rooms & Suites"}
          </div>
          <h2 className="wow fadeInUp">
            {"Our Facilites"}
          </h2>
        </div>
        <div className="col-lg-12 wow fadeInUp">
          <div className="owl-custom-nav menu-float px-5" data-target="#facilities-carousel">
            <a className="btn-next"></a>
            <a className="btn-prev"></a>
            <div id="facilities-carousel" className="owl-3-cols owl-carousel owl-theme">
              <div className="item">
                <img src="/images/facilities/1.webp" className="w-100 rounded-up-100" alt="" />
                <div className="mt-3 text-center">
                  <h4>
                    {"Cafe and Restaurant"}
                  </h4>
                </div>
              </div>
              <div className="item">
                <img src="/images/facilities/2.webp" className="w-100 rounded-up-100" alt="" />
                <div className="mt-3 text-center">
                  <h4>
                    {"Swimming Pool"}
                  </h4>
                </div>
              </div>
              <div className="item">
                <img src="/images/facilities/3.webp" className="w-100 rounded-up-100" alt="" />
                <div className="mt-3 text-center">
                  <h4>
                    {"Fitness Center"}
                  </h4>
                </div>
              </div>
              <div className="item">
                <img src="/images/facilities/4.webp" className="w-100 rounded-up-100" alt="" />
                <div className="mt-3 text-center">
                  <h4>
                    {"Meeting Room"}
                  </h4>
                </div>
              </div>
              <div className="item">
                <img src="/images/facilities/5.webp" className="w-100 rounded-up-100" alt="" />
                <div className="mt-3 text-center">
                  <h4>
                    {"Spa & Massage"}
                  </h4>
                </div>
              </div>
              <div className="item">
                <img src="/images/facilities/6.webp" className="w-100 rounded-up-100" alt="" />
                <div className="mt-3 text-center">
                  <h4>
                    {"Laundry Services"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="spacer-single"></div>
  </section>
  );
}
