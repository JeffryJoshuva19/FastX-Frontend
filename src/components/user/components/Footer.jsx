import React from "react";
import "../../user/user.css";

const Footer = () => {
  return (
    <footer className="user-footer">
      <p>© {new Date().getFullYear()} FastX. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
