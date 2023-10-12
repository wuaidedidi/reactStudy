import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Dropdown, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
const { Header } = Layout;
export default function TopHeader() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          {roleName}
        </a>
      ),
    },

    {
      key: "2",
      danger: true,
      label: "退出",
      onClick: (item) => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  return (
    <Header style={{ padding: 0, background: "white" }}>
      <Button
        type="text"
        icon={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right" }}>
        <span>
          欢迎<span style={{ color: "#1890ff" }}>{username}</span>
          回来
        </span>

        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Hover me
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
