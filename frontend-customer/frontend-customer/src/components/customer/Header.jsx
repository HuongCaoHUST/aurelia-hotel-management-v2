export default function Header() {
  return (
  <header className="transparent has-topbar">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="de-flex sm-pt10">
            <div className="de-flex-col">
              <div id="logo">
                <a href="#section-intro">
                  <img className="logo-main" src="/images/aurelia-logo-white.webp" alt="" />
                  <img className="logo-scroll" src="/images/aurelia-logo-black.webp" alt="" />
                  <img className="logo-mobile" src="/images/aurelia-logo-white.webp" alt="" />
                </a>
              </div>
            </div>
            <div className="de-flex-col header-col-mid">
              <ul id="mainmenu">
                <li>
                  <a className="menu-item" href="#section-intro">
                    {"Home"}
                  </a>
                </li>
                <li>
                  <a className="menu-item" href="#section-about">
                    {"About Us"}
                  </a>
                </li>
                <li>
                  <a className="menu-item" href="#section-rooms">
                    {"Accomodation"}
                  </a>
                </li>
                <li>
                  <a className="menu-item" href="#section_form">
                    {"Reservation"}
                  </a>
                </li>
                <li>
                  <a className="menu-item" href="#section-facilities">
                    {"Facilities"}
                  </a>
                </li>
              </ul>
            </div>
            <div className="de-flex-col">
              <div className="menu_side_area">
                <a href="#section_form" className="btn-main btn-line">
                  {"Reservation"}
                </a>
                <span id="menu-btn"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  );
}
