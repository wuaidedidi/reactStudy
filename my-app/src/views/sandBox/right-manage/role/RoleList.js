import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tree } from "antd";
import axios from "axios";
import MainContent from "../../../../components/sandBox/MainContent";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [rightsSource, setRightsSource] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (item) => {
    setCurrentRights(item.rights);
    setCurrentId(item.id);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          item.rights = currentRights;
        }
        return item;
      })
    );
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setDataSource(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setRightsSource(res.data);
    });
  }, []);

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
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  };

  const onCheckRight = (item) => {
    setCurrentRights(item.checked);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
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

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                showModal(item);
              }}
            ></Button>
            <Modal
              title="Basic Modal"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Tree
                checkable
                onCheck={onCheckRight}
                checkedKeys={currentRights}
                treeData={rightsSource}
                checkStrictly
              />
            </Modal>
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
        rowKey={(item) => {
          return item.id;
        }}
      ></Table>
    </MainContent>
  );
}
