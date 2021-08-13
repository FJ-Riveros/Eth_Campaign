import React from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Header from "./Header.js";

const Layout = (props) => {
  return (
    <Container>
      <Header></Header>
      {props.children}
      <h1>Im a footer</h1>
    </Container>
  );
};

export default Layout;
