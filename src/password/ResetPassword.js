import React from "react"
import "./Password.css"
import { Form, Input, Button } from "antd"

const ResetPassword = (props) => {
  return (
    <div className="forgot-password-container">
      <Form
        name="forgot_password"
        className="forgot-password-form"
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="new-password"
          rules={[{ required: true, message: "Please input your New Password!" }]}
        >
          <Input
            className="forgot-password-input"
            size="large"
            placeholder="New Password"
          />
        </Form.Item>
        <Form.Item
          name="new-password"
          rules={[{ required: true, message: "Please input your Confirm Password!" }]}
        >
          <Input
            className="forgot-password-input"
            size="large"
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="forgot-password-save-button"
          >
            Change password
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

export default ResetPassword