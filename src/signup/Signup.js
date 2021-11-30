import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import logo from "../assets/images/logo.png";
import { signup } from "../util/ApiUtil";
import "./Signup.css";

const Signup = (props) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      props.history.push("/");
    }
  }, [props.history]);

  const onFinish = (values) => {
    setLoading(true);
    signup(values)
      .then((response) => {
        notification.success({
          message: "Success",
          description:
            "A verification email has been sent to your email address!",
        });
        props.history.push("/signin");
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
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
          name="fullName"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input className="login-input" size="large" placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input className="login-input" size="large" placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input className="login-input" size="large" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input className="login-input" size="large" type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="login-button"
            loading={loading}
          >
            Signup
          </Button>
        </Form.Item>
        Already a member? <a href="/signin" className="login-text">Log in</a>
      </Form>
    </div>
  );
};

export default Signup;
