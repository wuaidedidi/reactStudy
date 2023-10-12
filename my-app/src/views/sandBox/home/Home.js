import React from "react";
import MainContent from "../../../components/sandBox/MainContent";
import axios from "axios";
import { Button } from "antd";
export default function Home() {
  const ajax = () => {
    // axios.get("/posts").then((res) => {
    //   console.log(res);
    // });
    // axios
    //   .post("/posts", {
    //     title: "3333",
    //     author: "lichen",
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });
    // axios.get("/users").then((res) => {});
  };
  return (
    <MainContent>
      <Button type="danger" onClick={ajax}>
        大白猪
      </Button>
    </MainContent>
  );
}
