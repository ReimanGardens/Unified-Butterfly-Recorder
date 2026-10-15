import React, { useState, useEffect } from "react";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { createContext } from "react";
import UserPool from "../../UserPool";

const AccountContext = createContext();

const Account = (props) => {
  const [loading, setLoading] = useState(true);
  const [userAuthorized, setUserAuthorized] = useState(false);
  const [currentUsername, setCurrentUsername] = useState()
  const [currentUserEmail, setCurrentUserEmail] = useState()

  const getSession = async () => {
    await new Promise((resolve, reject) => {
      const user = UserPool.getCurrentUser();
      if (user) {
        setCurrentUsername(user.username)

        user.getSession((err, session) => {
          if (err) {
            reject(err);
          } else {
            setCurrentUserEmail(session.idToken.payload.email)
            resolve(session);
          }
        });
      } else {
        reject();
      }
    });
  };

  const resetPassword = async (UN, ver) => {
    console.log("Reset password function called");
    await new Promise(() => {
      const cognitoUser = new CognitoUser({
        Username: UN,
        Pool: UserPool,
      });

      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          console.log("call result: " + result);
        },
        onFailure: function (err) {
          alert(err);
        },
        inputVerificationCode() {
          // this is optional, and likely won't be implemented as in AWS's example (i.e, prompt to get info)
          var verificationCode = prompt("Please input verification code ", "");
          var newPassword = prompt("Enter new password ", "");
          cognitoUser.confirmPassword(verificationCode, newPassword, this);
        },
      });
      console.log("End of reset password function");
    });
  };

  const authenticate = async (Username, Password) => {
    await new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username,
        Pool: UserPool,
      });
      // console.log(user.getUserAttributes())
      const authDetails = new AuthenticationDetails({
        Username,
        Password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(result);
          setUserAuthorized(true);
        },
        onFailure: (err) => {
          reject(err);
          setUserAuthorized(false);
          console.log(err);
        },
        newPasswordRequired: (data) => {
          console.log("new password required", data);
          resolve(data);
        },
      });


    });
  };

  const logout = () => {
    const user = UserPool.getCurrentUser();
    console.log("Logging out!");
    user.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    getSession()
      .then((session) => {
        // console.log("Session GOOD");
        setUserAuthorized(true);
        setLoading(false);
      })
      .catch((err) => {
        // console.log("Session BAD");
        setUserAuthorized(false);
        setLoading(false);
      });
  });

  const value = {
    currentUserEmail,
    currentUsername,
    userAuthorized,
    resetPassword,
    authenticate,
    getSession,
    logout,
  };

  return (
    <>
      {!loading && (
        <AccountContext.Provider value={value}>
          {props.children}
        </AccountContext.Provider>
      )}
    </>
  );
};

export { Account, AccountContext };
