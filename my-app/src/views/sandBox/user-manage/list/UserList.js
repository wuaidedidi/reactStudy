import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Modal, Switch } from "antd";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainContent from "../../../../components/sandBox/MainContent";
import UserForm from "../../../../components/user-manage/UserForm";

export default function UserList() {
  const [dataSource, SetDataSource] = useState([]);
  const [regionSource, SetRegionSource] = useState([]);
  const [roleSource, SetRoleSource] = useState([]);

  const [modal, contextHolder] = Modal.useModal();
  const addFrom = useRef(null);
  const updateFrom = useRef(null);
  const { roleId, username, region } = JSON.parse(
    localStorage.getItem("token")
  );
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const [current, setCurrent] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);

  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const showModal = () => {
    setIsAddUserOpen(true);
  };

  const showUpdateModal = (item) => {
    setUpdateItem(item);

    if (item.roleId === 1) {
      //禁用
      setIsUpdateDisabled(true);
    } else {
      //取消禁用
      setIsUpdateDisabled(false);
    }
    setIsUpdateUserOpen(true);

    setCurrent(item);
  };

  const userHandleOk = () => {
    addFrom.current
      .validateFields()
      .then((value) => {
        setIsAddUserOpen(false);
        addFrom.current.resetFields();
        axios
          .post("/users", {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            SetDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleSource.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateHandleOk = () => {
    updateFrom.current.validateFields().then((value) => {
      setIsUpdateUserOpen(false);

      SetDataSource(
        dataSource.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleSource.filter((item) => item.id === value.roleId)[0],
            };
          }
          return item;
        })
      );

      axios.patch(`/users/${current.id}`, value);
    });
    setIsUpdateDisabled(!isUpdateDisabled);
  };

  const userHandleCancel = () => {
    setIsAddUserOpen(false);
  };

  const updateHandleCancel = () => {
    setIsUpdateUserOpen(false);
    setIsUpdateDisabled(!isUpdateDisabled);
    // updateFrom.current.setFieldsValue();
  };

  const handlerUserStateChange = (item) => {
    item.roleState = !item.roleState;

    axios
      .patch(`/users/${item.id}`, {
        roleState: item.roleState,
      })
      .then((res) => {
        SetDataSource([...dataSource]);
      });
  };

  const confirmDelete = (item) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "确认删除角色吗",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteMethod(item);
      },
    });
  };

  const deleteMethod = (item) => {
    axios.delete(`/users/${item.id}`).then(() => {
      SetDataSource(
        dataSource.filter((data) => {
          return data.id !== item.id;
        })
      );
    });
  };

  const changeMethod = (item) => {};

  useEffect(() => {
    axios.get("/users?_expand=role").then((res) => {
      const list = res.data;

      SetDataSource(
        //判断是否是第一级管理员，是的话返回所有
        roleObj[roleId] === "superAdmin"
          ? list
          : [
              //不是的话，返回区域编辑用户自己本身的2级数据一个
              ...list.filter((item) => item.username === username),
              //然后返还区域编辑管理区域的3级用户
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, []); //没有设置的话，每次渲染都会调用，设置了空依赖的话，只有第一次会调用

  useEffect(() => {
    axios.get("/regions").then((res) => {
      const list = res.data;
      SetRegionSource(list);
    });
  }, []); //没有设置的话，每次渲染都会调用，设置了空依赖的话，只有第一次会调用

  useEffect(() => {
    axios.get("/roles").then((res) => {
      const list = res.data;

      SetRoleSource(list);
    });
  }, []); //没有设置的话，每次渲染都会调用，设置了空依赖的话，只有第一次会调用

  // 在组件渲染后设置表单数据
  useEffect(() => {
    if (updateItem) {
      updateFrom.current.setFieldsValue(updateItem);
    }
  }, [updateItem]);

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      render(region) {
        return <b>{region === "" ? "全球" : region}</b>;
      },
      filters: [
        ...regionSource.map((item) => {
          return {
            text: item.title,
            value: item.value,
          };
        }),
        {
          text: "全球",
          value: "",
        },
      ],
      onFilter: (value, record) => record.region === value,
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render(role) {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => {
              handlerUserStateChange(item);
            }}
          ></Switch>
        );
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
              disabled={item.default}
            ></Button>
            {contextHolder}

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                showUpdateModal(item);
              }}
              disabled={item.default}
            ></Button>
          </div>
        );
      },
    },
  ];

  return (
    <MainContent>
      <>
        <Button
          type="primary"
          onClick={() => {
            showModal();
          }}
        >
          添加用户
        </Button>
        <Modal
          title="用户详情"
          open={isAddUserOpen}
          onOk={userHandleOk}
          onCancel={userHandleCancel}
        >
          <UserForm
            roleList={roleSource}
            regionList={regionSource}
            ref={addFrom}
          ></UserForm>
        </Modal>

        <Modal
          title="用户修改"
          open={isUpdateUserOpen}
          onOk={updateHandleOk}
          onCancel={updateHandleCancel}
        >
          <UserForm
            roleList={roleSource}
            regionList={regionSource}
            ref={updateFrom}
            isUpdateDisabled={isUpdateDisabled}
            isUpdate="true"
          ></UserForm>
        </Modal>
      </>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(row) => row.id}
      />
    </MainContent>
  );
}
