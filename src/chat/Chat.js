import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  getUsers,
  countNewMessages,
  findChatMessages,
  findChatMessage,
} from "../util/ApiUtil";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  loggedInUser,
  chatActiveContact,
  chatMessages,
} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";

var stompClient = null;
const Chat = (props) => {
  const currentUser = useRecoilValue(loggedInUser);
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [messages, setMessages] = useRecoilState(chatMessages);

  useEffect(() => {
    if (activeContact === undefined) return;
    findChatMessages(activeContact.id, currentUser.id).then((msgs) => {
      console.log("xx: ", msgs)
      setMessages(msgs)
    }
  );
    loadContacts();
  }, [activeContact]);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    connect();
    loadContacts();
  }, []);

  const connect = () => {
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    SockJS = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(SockJS);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log("connected");
    console.log(currentUser);
    stompClient.subscribe(
      "/user/" + currentUser.id + "/queue/messages",
      onMessageReceived
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const onMessageReceived = (msg) => {
    const notification = JSON.parse(msg.body);
    const active = JSON.parse(sessionStorage.getItem("recoil-persist"))
      .chatActiveContact;

    if (active.id === notification.senderId) {
      findChatMessage(notification.id).then((message) => {
        const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist"))
          .chatMessages;
        newMessages.push(message);
        setMessages(newMessages);
      });
    } else {
      message.info("Received a new message from " + notification.senderName);
    }
    loadContacts();
  };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: currentUser.id,
        receiverId: activeContact.id,
        senderName: currentUser.name,
        receiverName: activeContact.name,
        content: msg,
      };
      stompClient.send("/app/chat", {}, JSON.stringify(message));

      const newMessages = [...messages];
      newMessages.push(message);
      setMessages(newMessages);
    }
  };

  const loadContacts = () => {
    const promise = getUsers().then((users) =>
      users.map((contact) =>
        countNewMessages(contact.id, currentUser.id).then((count) => {
          contact.newMessages = count;
          return contact;
        })
      )
    );

    promise.then((promises) =>
      Promise.all(promises).then((users) => {
        setContacts(users);
        if (activeContact === undefined && users.length > 0) {
          setActiveContact(users[0]);
        }
      })
    );
  };

  return (
    <div id="frame">
      <div id="sidepanel">
        <div id="profile">
          <div className="wrap">
            <img
              id="profile-img"
              src={currentUser.avatar}
              className="online"
              alt=""
            />
            <p>{currentUser.fullName}</p>
            <div id="status-options">
              <ul>
                <li id="status-online" className="active">
                  <span className="status-circle"></span> <p>Online</p>
                </li>
                <li id="status-away">
                  <span className="status-circle"></span> <p>Away</p>
                </li>
                <li id="status-busy">
                  <span className="status-circle"></span> <p>Busy</p>
                </li>
                <li id="status-offline">
                  <span className="status-circle"></span> <p>Offline</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="search" />
        <div id="contacts">
          <ul>
            {contacts.map((contact) => (
              <li
                onClick={() => setActiveContact(contact)}
                className={
                  activeContact && contact.id === activeContact.id
                    ? "contact active"
                    : "contact"
                }
              >
                <div className="wrap">
                  <span className="contact-status online"></span>
                  <img id={contact.id} src={contact.avatar} alt="" />
                  <div className="meta">
                    <p className="name">{contact.fullName}</p>
                    {contact.newMessages !== undefined &&
                      contact.newMessages > 0 && (
                        <p className="preview">
                          {contact.newMessages} new messages
                        </p>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="bottom-bar">
          <button id="addcontact">
            <i className="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
            <span>Profile</span>
          </button>
          <button id="settings">
            <i className="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
            <span>Settings</span>
          </button>
        </div>
      </div>
      <div className="content">
        <div className="contact-profile">
          <img src={activeContact && activeContact.avatar} alt="" />
          <p>{activeContact && activeContact.fullName}</p>
        </div>
        <ScrollToBottom className="messages">
          <ul>
            {messages.map((msg) => (
              <li className={msg.senderId === currentUser.id ? "sent" : "replies"}>
                {msg.senderId !== currentUser.id && (
                  <img src={activeContact.avatar} alt="" />
                )}
                <p>{msg.content}</p>
              </li>
            ))}
          </ul>
        </ScrollToBottom>
        <div className="message-input">
          <div className="wrap">
            <input
              name="user_input"
              size="large"
              placeholder="Write your message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  sendMessage(text);
                  setText("");
                }
              }}
            />

            <Button
              icon={<i className="fa fa-paper-plane" aria-hidden="true"></i>}
              onClick={() => {
                sendMessage(text);
                setText("");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
