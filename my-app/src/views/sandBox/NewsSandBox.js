import React, { useEffect } from "react";
import TopHeader from "../../components/sandBox/TopHeader";
import SideMenu from "../../components/sandBox/SideMenu";

import Home from "./home/Home";
import UserList from "./user-manage/list/UserList";
import RoleList from "./right-manage/role/RoleList";
import RightList from "./right-manage/right/RightList";
import NoPermission from "./noPermission/NoPermission";
import { Layout, Footer } from "antd";

export default function NewsSandBox(props) {
  function MainContent() {
    let elementName = props.elementName;
    if (elementName === "Home") {
      return <Home />;
    } else if (elementName === "UserList") {
      return <UserList />;
    } else if (elementName === "RoleList") {
      return <RoleList />;
    } else if (elementName === "RightList") {
      return <RightList />;
    } else if (elementName === "NoPermission") {
      return <NoPermission />;
    }
  }

  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <MainContent></MainContent>
      </Layout>
    </Layout>
  );
}
