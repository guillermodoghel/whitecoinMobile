import React from "react";
import Setup from "./src/boot/setup";
console.disableYellowBox = true;
export default class App extends React.Component {
  render() {
    return <Setup />;
  }
}
