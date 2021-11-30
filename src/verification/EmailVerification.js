import React, { useEffect, useState } from "react";
import "./EmailVerification.css"
import { useLocation } from "react-router-dom"
import { getEmailVerificationMessage } from "../util/ApiUtil"

function EmailVerification() {
  const [message, setMessage] = useState()
  const search = useLocation().search
  const token = new URLSearchParams(search).get("token")

  useEffect(() => {
    getEmailVerificationMessage(token).then((res) => {
      switch (res.message) {
        case "INVALID":
          setMessage("Your verification token is invalid!")
          break
        case "EXPIRED":
          setMessage("Your verification token has expired!")
          break
        case "SUCCESSFULLY_ACTIVATED":
          setMessage("Your account is successfully activated!")
          break
        case "ALREADY_ACTIVATED":
          setMessage("Your account is already activated!")
          break
        default:
          setMessage("Something went wrong, please try again!")
      }
    })
  }, [token])

  return (
    <div className="container verification-wrapper">
      <div className="verification-container">
        {message}
      </div>
    </div>
  )
}

export default EmailVerification
