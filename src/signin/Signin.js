import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
  // FacebookFilled,
} from "@ant-design/icons";
import logo from "../assets/images/logo.png";
// eslint-disable-next-line no-unused-vars
import { login, facebookLogin } from "../util/ApiUtil";
import "./Signin.css";
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";

/*global FB*/

const Signin = (props) => {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  // const [facebookLoading, setFacebookLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [test, setTest] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      props.history.push("/signin");
    }
    initFacebookLogin();
  }, [props.history]);

  useEffect(() => {
    initFacebookLogin();
  }, [test]);

  const initFacebookLogin = () => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "118319422120166",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v7.0",
      });
    };
  };

  // const getFacebookAccessToken = () => {
  //   setFacebookLoading(true);
  //   FB.login(
  //     function (response) {
  //       if (response.status === "connected") {
  //         const facebookLoginRequest = {
  //           accessToken: response.authResponse.accessToken,
  //         };
  //         facebookLogin(facebookLoginRequest)
  //           .then((response) => {
  //             localStorage.setItem("accessToken", response.accessToken);
  //             props.history.push("/");
  //             setFacebookLoading(false);
  //           })
  //           .catch((error) => {
  //             if (error.status === 401) {
  //               notification.error({
  //                 message: "Error",
  //                 description: "Invalid credentials",
  //               });
  //             } else {
  //               notification.error({
  //                 message: "Error",
  //                 description:
  //                   error.message ||
  //                   "Sorry! Something went wrong. Please try again!",
  //               });
  //             }
  //             setFacebookLoading(false);
  //           });
  //       } else {
  //         console.log(response);
  //       }
  //     },
  //     { scope: "email" }
  //   );
  // };

  const onFinish = (values) => {
    setLoading(true);
    login(values)
      .then((response) => {
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("user", response);
        setLoggedInUser(response);
        props.history.push("/");
        setLoading(false);
      })
      .catch((error) => {
        if (error.status === 401) {
          notification.error({
            message: "Error",
            description: "Username or Password is incorrect. Please try again!",
          });
        } else {
          notification.error({
            message: "Error",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <img src={logo} alt={logo} className="login-logo" />
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            className="login-input"
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            className="login-input"
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <a className="forgot-password" href="/forgot-password">
          Forgot password?
        </a>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="login-button"
            loading={loading}
          >
            Sign In
          </Button>
        </Form.Item>
        <Divider>OR</Divider>
        {/* <Form.Item>
          <Button
            icon={<FacebookFilled style={{ fontSize: 20 }} />}
            loading={facebookLoading}
            className="login-button"
            shape="round"
            size="large"
            onClick={getFacebookAccessToken}
          >
            Sign In With Facebook
          </Button>
        </Form.Item> */}
        Not a member yet? <a href="/signup" className="login-text">Sign Up</a>
      </Form>
    </div>
  );
};

export default Signin;
