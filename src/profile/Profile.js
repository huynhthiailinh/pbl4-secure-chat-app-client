import React, { useEffect } from "react";
import { Card, Avatar } from "antd";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import "./Profile.css";

const { Meta } = Card;

const Profile = (props) => {
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
          description={"@" + currentUser.username}
        />
      </Card>
    </div>
  );
};

export default Profile;
