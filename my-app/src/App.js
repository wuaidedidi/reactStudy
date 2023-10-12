import React, { useEffect } from "react";
import "./App.css";

import axios from "axios";

function App() {
  useEffect(() => {
    axios.get("/ajax/cities").then((res) => {
      console.log(res);
    });
  }, []); //空的数组表示只在组件挂载和卸载时运行
  return <div></div>;
}

export default App;
