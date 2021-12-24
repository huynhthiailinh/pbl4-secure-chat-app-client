import React, { useState } from "react"
import "./Password.css"
import { Form, Input, Button, notification } from "antd"
import { MailOutlined } from "@ant-design/icons"
import { forgotPassword } from "../util/ApiUtil"

const ForgotPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [showCheckMailNotify, setShowCheckMailNotify] = useState(false)

  const onSend = (data) => {
    setLoading(true)
    forgotPassword({ email: data.email})
      .then(() => {
        setShowCheckMailNotify(true)
        setLoading(false)
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: error.message || "Sorry! Something went wrong. Please try again!"
        })
        setLoading(false)
      })
  }
  return (
    <div className="forgot-password-container">
      <Form
        name="forgot_password"
        className="forgot-password-form"
        initialValues={{ remember: true }}
        onFinish={onSend}
      >
        <div className={`forgot-password-label ${!showCheckMailNotify && "hidden"}`}>
          Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
        </div>
        <div className={`${showCheckMailNotify && "hidden"}`}>
          <div className="forgot-password-label">Enter your account's verified email address and we will send you a password reset link.</div>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              className="forgot-password-input"
              size="large"
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item>
            <Button
              shape="round"
              size="large"
              htmlType="submit"
              className="forgot-password-save-button"
              loading={loading}
            >
              Send
            </Button>
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            className="forgot-password-cancel-button"
            onClick={() => props.history.push("/signin")}
          >
            Return to sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ForgotPassword
