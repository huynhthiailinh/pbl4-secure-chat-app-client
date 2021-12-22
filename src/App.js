import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Signin from "./signin/Signin";
import Signup from "./signup/Signup";
import Profile from "./profile/Profile";
import Chat from "./chat/Chat";
import EmailVerification from "./verification/EmailVerification"
import ForgotPassword from "./password/ForgotPassword"
import ResetPassword from "./password/ResetPassword"
import "./App.css";

export const AppContext = React.createContext();
const App = (props) => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Chat {...props} />}
          />
          <Route
            exact
            path="/signin"
            render={(props) => <Signin {...props} />}
          />
          <Route
            exact
            path="/signup"
            render={(props) => <Signup {...props} />}
          />
          <Route
            exact
            path="/profile"
            render={(props) => <Profile {...props} />}
          />
          <Route
            exact
            path="/active-email"
            render={(props) => <EmailVerification {...props} />}
          />
          <Route
            exact
            path="/forgot-password"
            render={(props) => <ForgotPassword {...props} />}
          />
          <Route
            exact
            path="/reset-password"
            render={(props) => <ResetPassword {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
