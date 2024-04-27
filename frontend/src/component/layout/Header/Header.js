import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
const options = {
  burgerColor:"#034694",
  burgerColorHover: "#1560bd",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#034694",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Search",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/search",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#034694",
  link1Margin: "1vmax",
  profileIconUrl: "/login",
  profileIconColor:"rgba(35, 35, 35,0.8)",
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIconColorHover: "#034694",
  searchIconColorHover: "#034694",
  cartIconColorHover: "#034694",
  cartIconMargin: "1vmax",
};

const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;