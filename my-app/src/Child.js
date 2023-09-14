import React from "react";
import Style from "./Child.module.scss";

function child() {
  return (
    <div>
      <ul>
        <li className={Style.item}>1111</li>
        <li className={Style.item}>2222</li>
      </ul>
    </div>
  );
}
export default child;
