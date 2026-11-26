export default function HeroSection() {
  return (
  <section id="section-intro" className="section-dark text-light no-top no-bottom position-relative overflow-hidden z-1000">
    <div className="v-center">
      <div className="swiper">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="swiper-inner" data-bgimage="url(/images/slider/1.jpg)">
              <div className="sw-caption z-1000">
                <div className="container">
                  <div className="row g-4 align-items-center">
                    <div className="spacer-double"></div>
                    <div className="col-lg-8 offset-lg-2 text-center">
                      <div className="spacer-single"></div>
                      <div className="sw-text-wrapper">
                        <div className="slider-extra mb-3">
                          <span className="d-stars">
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                          </span>
                        </div>
                        <h1 className="slider-title mb-4">
                          {"Where Every Stay is Extraordinary"}
                        </h1>
                        <p className="col-lg-8 offset-lg-2 slider-teaser px-4 mb-0">
                          {"Discover the perfect blend of luxury, comfort, and convenience at Aurelia. Nestled in the heart of Brooklyn, our hotel is your gateway to an unforgettable experience."}
                        </p>
                        <div className="spacer-30"></div>
                        <a className="btn-main mb10 mb-3" href="#section-rooms">
                          {"Our Accomodation"}
                        </a>
                      </div>
                    </div>
                    <div className="spacer-single"></div>
                  </div>
                </div>
              </div>
              <div className="abs abs-centered w-40">
                <div className="box-slider-decor"></div>
              </div>
              <div className="sw-overlay op-2"></div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="swiper-inner" data-bgimage="url(/images/slider/2.jpg)">
              <div className="sw-caption z-1000">
                <div className="container">
                  <div className="row g-4 align-items-center">
                    <div className="spacer-double"></div>
                    <div className="col-lg-8 offset-lg-2 text-center">
                      <div className="spacer-single"></div>
                      <div className="sw-text-wrapper">
                        <div className="slider-extra mb-3">
                          <span className="d-stars">
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                            <i className="icofont-star"></i>
                          </span>
                        </div>
                        <h1 className="slider-title mb-4">
                          {"Experience Hospitality Like Never Before"}
                        </h1>
                        <p className="col-lg-8 offset-lg-2 slider-teaser px-4 mb-0">
                          {"Discover the perfect blend of luxury, comfort, and convenience at Aurelia. Nestled in the heart of Brooklyn, our hotel is your gateway to an unforgettable experience."}
                        </p>
                        <div className="spacer-30"></div>
                        <a className="btn-main mb10 mb-3" href="#section-rooms">
                          {"Our Accomodation"}
                        </a>
                      </div>
                    </div>
                    <div className="spacer-single"></div>
                  </div>
                </div>
              </div>
              <div className="abs abs-centered w-40">
                <div className="box-slider-decor"></div>
              </div>
              <div className="sw-overlay op-2"></div>
            </div>
          </div>
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-scrollbar"></div>
      </div>
    </div>
  </section>
  );
}
