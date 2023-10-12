import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import Login from "../views/login/Login";

import NewsSandBox from "../views/sandBox/NewsSandBox";

function PrivateRoute({ children }) {
  //添加一个授权逻辑
  const isAuthenticated = true;
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    //直接跳出，防止看到其他受限内容
    console.log("禁止访问");
    return <Navigate to={"/login"} />;
  }
  return children;
}

export default function IndexRouter() {
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/rights"),
      axios.get("http://localhost:8000/children"),
    ]).then((res) => {
      console.log(res);
    });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route
          path="/*"
          element={
            <PrivateRoute>
              <NewsSandBox />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/home"
          element={<NewsSandBox elementName="Home" />}
        ></Route>
        <Route
          path="/user-manage/list"
          element={<NewsSandBox elementName="UserList" />}
        ></Route>
        <Route
          path="/right-manage/role/list"
          element={<NewsSandBox elementName="RoleList" />}
        ></Route>
        <Route
          path="/right-manage/right/list"
          element={<NewsSandBox elementName="RightList" />}
        ></Route>
        <Route path="/" element={<NewsSandBox elementName="Home" />} />
        <Route
          path="/*"
          element={<NewsSandBox elementName="NoPermission" />}
        ></Route>
      </Routes>
    </Router>
  );
}
