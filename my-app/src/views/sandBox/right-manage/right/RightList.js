import React, { useEffect, useState } from "react";
import { Button, Table, Tag, Modal, Popover, Switch } from "antd";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainContent from "../../../../components/sandBox/MainContent";
export default function RightList() {
  const [dataSource, SetDataSource] = useState([]);

  const [modal, contextHolder] = Modal.useModal();

  const confirmDelete = (item) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "确认删除权限吗",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteMethod(item);
      },
    });
  };

  const deleteMethod = (item) => {
    console.log(item);

    if (item.grade === 1) {
      SetDataSource(dataSource.filter((data) => data.id !== item.id));
      axios.delete(`/rights/${item.id}`);
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId);
      list[0].children = list[0].children.filter(
        (childrenData) => childrenData.id !== item.id
      );

      SetDataSource([...dataSource]);
      axios.delete(`/children/${item.id}`);
    }
  };

  const changeMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    console.log(item);
    SetDataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach((element) => {
        if (element.children.length === 0) {
          element.children = "";
        }
      });
      SetDataSource(list);
    });
  }, []); //没有设置的话，每次渲染都会调用，设置了空依赖的话，只有第一次会调用

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => {
        return <Tag color="orange">{key}</Tag>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              onClick={() => {
                confirmDelete(item);
              }}
              icon={<DeleteOutlined />}
            ></Button>
            {contextHolder}
            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => {
                      changeMethod(item);
                    }}
                  ></Switch>
                </div>
              }
              title="是否开启权限"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              ></Button>
            </Popover>
          </div>
        );
      },
    },
  ];

  return (
    <MainContent>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
      ;
    </MainContent>
  );
}
