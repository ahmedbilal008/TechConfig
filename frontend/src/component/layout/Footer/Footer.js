import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
      <img
              style={{ width: "15vmax", height: "15vmax", margin: "0.2vmax 0" }}
              src="https://res.cloudinary.com/dwfv2ooij/image/upload/v1703613188/pics/dfayrlzk618ewynhwdke.png"
              alt="Logo"
            />
      </div>

      <div className="midFooter">
        <h1>TECHCONFIG.</h1>
        <p>High Quality is our first priority</p>
        <p>Copyrights 2023 &copy; AB and Sons</p>
      </div>

      <div className="rightFooter">
        <h4>Contact Us</h4>
        <a className="mailBtn" href="mailto:storeecommerce91@gmail.com">
         TechConfig@gmail.com
      </a>
      </div>
    </footer>
  );
};

export default Footer;