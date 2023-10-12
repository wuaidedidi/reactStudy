import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import axios from "axios";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./index.css";
import { useNavigate, useLocation, Route } from "react-router-dom";
const { Sider } = Layout;

export default function SideMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setMenu] = useState([]);
  const [openKeys, setOpenKeys] = useState([]); // 添加openKeys状态
  const navigate = useNavigate();
  const location = useLocation();
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    fetchMenuData();
  }, []);

  // 刷新页面时，根据当前路由设置openKeys
  useEffect(() => {
    const currentPath = location.pathname;
    const openKey = Object.keys(iconMapping).find((key) =>
      currentPath.startsWith(key)
    );
    if (openKey) {
      setOpenKeys([openKey]);
    }
  }, [location.pathname]);
  async function fetchMenuData() {
    try {
      const response = await axios.get("/rights?_embed=children");
      const menuItems = response.data.map((item) => {
        const menuItem = {
          key: item.key,
          icon: iconMapping[item.key],
          label: item.title,
        };

        // 对 item.children 进行逻辑判断
        if (item.children && item.children.length > 0) {
          menuItem.children = mapChildren(item.children);
        }
        if (rights.includes(item.key)) {
          return menuItem;
        }
      });
      setMenu(menuItems);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  }

  function mapChildren(children) {
    if (!children || children.length === 0) {
      return [];
    }
    return children
      .filter(
        (child) => child.pagepermisson === 1 && rights.includes(child.key)
      ) // 筛选出 pagepermisson 等于 1 的子项
      .map((child) => ({
        key: child.key,
        icon: iconMapping[child.key],
        label: child.title,
        onTitleClick: (item) => {
          navigate(item.key);
        },
      }));
  }

  const iconMapping = {
    "/home": <PieChartOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <TeamOutlined />,
    "/news-manage": <FileOutlined />,
    "/audit-manage": <DesktopOutlined />,
    "/publish-manage": <TeamOutlined />,
  };

  return (
    <Sider
      trigger={null}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="logo"> 全球新闻发布系统</div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={location.pathname}
        openKeys={openKeys} // 设置openKeys
        onOpenChange={(keys) => setOpenKeys(keys)} // 处理展开菜单的变化
        items={items}
        onClick={(item) => {
          navigate(item.key);
        }}
      />
    </Sider>
  );
}
