import React, { useEffect } from "react";
import { Layout } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const { Content } = Layout;
export default function MainContent(props) {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Content
      style={{
        margin: "24px 24px",
        padding: 24,
        minHeight: 280,
        overflow: "auto", //只会在Content中显示滚动，不会突破Content的限制
      }}
    >
      {props.children}
    </Content>
  );
}
