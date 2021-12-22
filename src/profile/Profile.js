import React, { useEffect, useState } from "react";
import { Card, Avatar, Form, Input, Upload, notification, Button } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { EditOutlined, LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import "./Profile.css";
import cho from "./../../src/assets/images/avatars/cho.jpg"
import ImgCrop from 'antd-img-crop'
import { getImage, uploadAvatar, changePassword } from "../util/ApiUtil"

const { Meta } = Card;

const Profile = (props) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/signin");
    }
  }, [props.history]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/signin");
  };

  const chat = () => {
    props.history.push("/");
  };

  const onChangeAvatar = (e) => {
    const formData = new FormData()
    formData.append("type", "avatar")
    formData.append("id", currentUser.id)
    formData.append("multipartFile", e.file)
    uploadAvatar(formData).then(res => {
      const data = Object.assign({}, currentUser)
      data.avatar = res
      setLoggedInUser(data)
    })
  }

  const onChangePassword = (data) => {
    changePassword({
      accountId: currentUser.id,
      password: data.newPassword
    })
      .then(() => {
        notification.success({
          message: "Success",
          description:
            "You have successfully changed your password. Please return to sign in.",
        });
        props.history.push("/signin");
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  }

  const Description = () => {
    return (
      <div>
        <div>
          <span>Username: </span>
          {currentUser.username}
        </div>
        <div>
          <span>Email: </span>
          {currentUser.email}
        </div>
      </div>
    )
  }

  const toggleEditProfile = () => {
    setShowEditProfile(!showEditProfile);
    if (showChangePassword) {
      setShowChangePassword(false);
    }
  };

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    if (showEditProfile) {
      setShowEditProfile(false);
    }
  };

  return (
    <div className="profile-container">
      <Card
        actions={[
          <MessageOutlined onClick={chat} />,
          <LogoutOutlined onClick={logout} />
        ]}
      >
        <Meta
          avatar={
            <ImgCrop rotate>
              <Upload
                showUploadList={false}
                customRequest={onChangeAvatar}
              >
                <div className="upload-button">
                  <EditOutlined />
                </div>
                <Avatar
                  src={currentUser.avatar ? getImage(currentUser.avatar) : cho}
                  className="user-avatar-circle"
                />
              </Upload>
            </ImgCrop>
          }
          title={currentUser.fullName}
          description={<Description />}
        />
        <div className="button-group">
          <button onClick={toggleEditProfile}>{showEditProfile ? 'Close Edit Profile' : 'Edit Profile'}</button>
          <button onClick={toggleChangePassword}>{showChangePassword ? 'Close Change Password' : 'Change Password'}</button>
        </div>
        <Form
          layout='vertical'
          style={{ display: showEditProfile ? "block" : "none" }}
        >
          <Form.Item label="Username">
            <Input placeholder="input username" value={currentUser.username} />
          </Form.Item>
          <Form.Item label="Email">
            <Input placeholder="input email" value={currentUser.email} />
          </Form.Item>
          <Form.Item>
            <div className="button-group">
              <button>Save</button>
              <button>Cancel</button>
            </div>
          </Form.Item>
        </Form>
        <Form
          layout='vertical'
          style={{ display: showChangePassword ? "block" : "none" }}
          onFinish={onChangePassword}
        >
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              { required: true, message: "Password is required!" },
              { min: 6, message: "Password must be minimum 6 characters!"}
            ]}
          >
            <Input
              placeholder="input new password"
              type="password"
            />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Password is required!" },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords that you entered do not match!');
                },
              }),
            ]}
          >
            <Input
              placeholder="confirm new password"
              type="password"
            />
          </Form.Item>
          <Form.Item>
            <div className="button-group">
              <Button htmlType="submit">Save</Button>
              <Button>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
