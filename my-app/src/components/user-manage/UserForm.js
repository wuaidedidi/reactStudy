import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
  const [isDisabled, SetIsDisabled] = useState(false);

  useEffect(() => {
    SetIsDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const checkRegionDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return item.value !== region;
      }
    }
  };
  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return roleObj[item.id] !== "editor";
      }
    }
  };
  return (
    <Form
      layout="vertical"
      ref={ref}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="userId" name="id"></Form.Item>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "请输入你的用户名!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "请输入你的密码!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: "请选择你的区域!",
                },
              ]
        }
      >
        <Select
          disabled={isDisabled}
          placeholder="请选择区域"
          onChange={() => {}}
          allowClear
        >
          {props.regionList.map((item) => {
            return (
              <Option
                value={item.value}
                key={item.id}
                disabled={checkRegionDisabled(item)}
              >
                {item.title}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "请选择你的角色!",
          },
        ]}
      >
        <Select
          placeholder="请选择一个角色"
          onChange={(value) => {
            if (value === 1) {
              ref.current.setFieldsValue({
                region: "",
              });
              SetIsDisabled(true);
            } else {
              SetIsDisabled(false);
            }
          }}
          allowClear
        >
          {props.roleList.map((item) => {
            return (
              <Option
                value={item.id}
                key={item.id}
                disabled={checkRoleDisabled(item)}
              >
                {item.roleName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;
