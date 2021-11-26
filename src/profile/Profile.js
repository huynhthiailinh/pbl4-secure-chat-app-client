import React, { useEffect, useState } from "react";
import { Card, Avatar, Form, Input } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import "./Profile.css";

const { Meta } = Card;

const Profile = (props) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentUser] = useRecoilState(loggedInUser);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
  };

  const chat = () => {
    props.history.push("/chat");
  };

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
            <Avatar
              src={currentUser.avatar}
              className="user-avatar-circle"
            />
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
        >
          <Form.Item label="Current password">
            <Input placeholder="input current password" type="password" />
          </Form.Item>
          <Form.Item label="New password">
            <Input placeholder="input new password" type="password" />
          </Form.Item>
          <Form.Item>
            <div className="button-group">
              <button>Save</button>
              <button>Cancel</button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
