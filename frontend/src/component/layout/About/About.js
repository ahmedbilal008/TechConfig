import React from "react";
import "./aboutSection.css";
import {Typography, Avatar } from "@material-ui/core";
const About = () => {
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "15vmax", height: "15vmax", margin: "0.2vmax 0" }}
              src="https://res.cloudinary.com/dwfv2ooij/image/upload/v1703613188/pics/dfayrlzk618ewynhwdke.png"
              alt="Logo"
            />
            <Typography>TECHCONFIG TEAM</Typography>
            <span>
            Welcome to TechConfig, where technology meets innovation in this semester project for 
            Database Systems and Software Engineering. Our online store is more than just 
            a marketplace for laptops and PC components; it's a culmination of meticulous 
            database design and software engineering principles. Designed for our academic exploration, 
            this project seamlessly integrates a components compatibility feature, 
            allowing you to build the perfect computing system with ease. 
            Whether you're a gamer, creative professional, or tech enthusiast, 
            each product contributes to a cohesive, well-engineered solution. 
            Explore our platform, delve into the world of compatibility, 
            and witness the result of our academic journey unfolding in every click.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;