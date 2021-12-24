import React, { useEffect, useState } from "react"
import "./Password.css"
import { Form, Input, Button, notification } from "antd"
import { useLocation } from "react-router-dom";
import { resetPassword, savePassword } from "../util/ApiUtil";

const ResetPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [showInputPasswordForm, setShowInputPasswordForm] = useState(false)
  const [message, setMessage] = useState()
  const search = useLocation().search
  const token = new URLSearchParams(search).get("token").trim()

  useEffect(() => {
    resetPassword(token).then((res) => {
      if (res.message === "ENTER_NEW_PASSWORD")
        setShowInputPasswordForm(true)
      else
        setShowInputPasswordForm(false)
      if (res.message === "INVALID_TOKEN")
        setMessage("It looks like you clicked on an invalid password reset link or this password reset link has been used before. Please try again!")
      if (res.message === "EXPIRED_TOKEN")
        setMessage("The password reset link will expire within 3 hours. To get a new password reset link, visit forgot password page!")
    })
  }, [])

  const onSavePassword = (data) => {
    setLoading(true)
    savePassword({
      token: token,
      password: data.newPassword
    })
      .then(() => {
        setShowInputPasswordForm(false)
        setMessage("You have successfully changed your password. Please return to sign in.")
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
        onFinish={onSavePassword}
      >
        <div className={`${showInputPasswordForm && "hidden"}`}>
          {message}
        </div>
        <div className={`${!showInputPasswordForm && "hidden"}`}>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: "Please input your New Password!" }]}
          >
            <Input
              className="forgot-password-input"
              size="large"
              placeholder="New Password"
              type="password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: "Please input your Confirm Password!" }]}
          >
            <Input
              className="forgot-password-input"
              size="large"
              placeholder="Confirm Password"
              type="password"
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
              Change password
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

export default ResetPassword
