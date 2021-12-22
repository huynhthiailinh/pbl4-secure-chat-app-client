import React from "react"
import "./Password.css"
import { Form, Input, Button } from "antd"
import { MailOutlined } from "@ant-design/icons"

const ForgotPassword = (props) => {
  return (
    <div className="forgot-password-container">
      <Form
        name="forgot_password"
        className="forgot-password-form"
        initialValues={{ remember: true }}
      >
        <div className="forgot-password-label">Enter your account's verified email address and we will send you a password reset link.</div>
        {/* <div className="forgot-password-label">Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</div> */}
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            className="forgot-password-input"
            size="large"
            prefix={<MailOutlined className="forgot-password-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="forgot-password-save-button"
          >
            Send
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            className="forgot-password-cancel-button"
            onClick={() => {
              props.history.push("/signin")
            }
            }
          >
            Return to sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ForgotPassword