import React, { useEffect, useState } from "react";
import { Button, message, Input, Upload, Modal } from "antd";
import {
  getUsers,
  countNewMessages,
  findChatMessages,
  findChatMessage, getImage, getAllUsersForSearch,
} from "../util/ApiUtil"
import { useRecoilValue, useRecoilState } from "recoil";
import {
  loggedInUser,
  chatActiveContact,
  chatMessages,
} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import dog from "./../assets/images/avatars/cho.jpg"
import $ from "jquery";
import { useDetectClickOutside } from "react-detect-click-outside"
import Axios from "axios"

var stompClient = null;
const { Search } = Input
const Chat = (props) => {
  const currentUser = useRecoilValue(loggedInUser);
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [messages, setMessages] = useRecoilState(chatMessages);
  const [accountList, setAccountList] = useState([])
  const [accountSearchList, setAccountSearchList] = useState([])

  useEffect(() => {
    if (activeContact === undefined) return;
    findChatMessages(currentUser.id, activeContact.id).then((msgs) => {
      setMessages(msgs)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact]);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/signin");
    }
    connect();
    loadContacts();
    getAllAccountForSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = () => {
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    SockJS = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(SockJS);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
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
    if (msg.trim() !== "" && activeContact) {
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

    if (msg.trim() === "" && fileList.length > 0) {
      fileList.forEach(file => {
        const formData = new FormData()
        formData.append('file', file.originFileObj)
        formData.append('upload_preset', 'sweetagram')
        formData.append('api_key', '195611112789657')
        Axios.post('https://api.cloudinary.com/v1_1/bongudth/image/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(res => {
            const message = {
              senderId: currentUser.id,
              receiverId: activeContact.id,
              senderName: currentUser.name,
              receiverName: activeContact.name,
              content: res.data.url,
            };
            stompClient.send("/app/chat", {}, JSON.stringify(message));

            const newMessages = [...messages];
            newMessages.push(message);
            setMessages(newMessages);
            setFileList([])
          })
      })
    }
  };

  const loadContacts = () => {
    const promise = getUsers(currentUser.id).then((users) =>
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

  const getAllAccountForSearch = () => {
    getAllUsersForSearch(currentUser.id)
      .then(res => {
        setAccountList(res)
        setAccountSearchList(res)
      });
  }

  const profile = () => {
    props.history.push("/profile");
  };

  const signout = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/signin");
  };

  const handleFocusSearch = () => {
    $('.search-user-wrapper').css('height', '100%');
    $('.list-search-account').removeClass('hidden');
  }

  const handleCloseSearchAccount = (e) => {
    $('.search-user-wrapper').css('height', 'unset');
    $('.list-search-account').addClass('hidden');
  }

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    const newAccountSearchList = accountList.filter(account => {
      return account.fullName.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""));
    });
    setAccountSearchList(newAccountSearchList);
  }

  const ref = useDetectClickOutside({ onTriggered: handleCloseSearchAccount });

  const addAccountToListContact = (event, account) => {
    event.preventDefault();
    if (!contacts.some(item => item.id === account.id)) {
      setContacts([...contacts, account])
      setActiveContact(account)
      setAccountList(accountList.filter(item => item.id !== account.id))
    }
    $('.search-user-wrapper').css('height', 'unset');
    $('.list-search-account').addClass('hidden');
  }

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([])
  const [previewTitle, setPreviewTitle] = useState('')

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleCancel = () => {
    setPreviewVisible(false)
  }

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview)
    setPreviewTitle(file.name || file.url.split('/').pop())
    setPreviewVisible(true)
  }

  const handleChange = (files) => {
    setFileList(files)
  }

  const isUrlImage = (text) => {
    return text.startsWith('http') && text.endsWith('.jpg')
  }

  const isUrlFile = (text) => {
    return text.startsWith('http') && (text.endsWith('.pdf') || text.endsWith('.doc') || text.endsWith('.docx'))
  }

  const uploadButton = (
    <div className="send-button">
      <i className="far fa-image" aria-hidden="true"></i>
    </div>
  )

  return (
    <div id="frame">
      <div id="sidepanel">
        <div id="profile">
          <div className="wrap">
            <img
              id="profile-img"
              src={currentUser?.avatar ? getImage(currentUser?.avatar) : dog}
              className="online"
              alt=""
            />
            <div>{currentUser.fullName}</div>
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
        <div id="contacts">
          <div className="search-user-wrapper" ref={ref}>
            <Search
              className="search"
              placeholder="Search someone.."
              allowClear
              onFocus={handleFocusSearch}
              onChange={handleChangeSearch}
            />
            <div className="list-search-account hidden">
              {
                accountSearchList.map((account, index) => (
                  <div className="search-account-item" key={index} onClick={(event) => addAccountToListContact(event, account)}>
                    <img
                      id={account.id}
                      src={account.avatar ? getImage(account.avatar) : dog}
                      alt=""
                      className="contact-img" />
                    <div>{account.fullName}</div>
                  </div>
                )
                )
              }
            </div>
          </div>
          <div className="list-user">
            <ScrollToBottom>
              <ul>
                {contacts.map((contact, index) => (
                  <li
                    key={index}
                    onClick={() => setActiveContact(contact)}
                    className={
                      activeContact && contact.id === activeContact.id
                        ? "contact active"
                        : "contact"
                    }
                  >
                    <div className="wrap">
                      <span className="contact-status online"></span>
                      <img
                        id={contact.id}
                        src={contact.avatar ? getImage(contact.avatar) : dog}
                        alt=""
                        className="contact-img" />
                      <div className="meta">
                        <div className="name">{contact.fullName}</div>
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
            </ScrollToBottom>
          </div>
        </div>
        <div id="bottom-bar">
          <button id="addcontact" onClick={profile}>
            <i className="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
            <span>Profile</span>
          </button>
          <button id="settings" onClick={signout}>
            <i className="fas fa-sign-out-alt" aria-hidden="true"></i>{" "}
            <span>Sign out</span>
          </button>
        </div>
      </div>
      <div className="content">
        {activeContact && (
          <div className="contact-profile">
            <img
              src={activeContact.avatar ? getImage(activeContact.avatar) : dog}
              alt=""
              className="active-img"
            />
            <div>{activeContact.fullName}</div>
          </div>
        )}
        <ScrollToBottom className="messages">
          <ul>
            {messages.map((msg, index) => (
              <li key={index} className={msg.senderId === currentUser.id ? "sent" : "replies"}>
                {msg.senderId !== currentUser.id && (
                  <img className="avatar-chat" src={activeContact?.avatar ? getImage(activeContact?.avatar) : dog} alt="" />
                )}
                {isUrlImage(msg.content) ?
                  (<img src={msg.content} alt="" className="msg-image" />) :
                  isUrlFile(msg.content) ?
                    (<a href={msg.content} target="_blank" rel="noopener noreferrer"><p>Download</p></a>) :
                    (<p>{msg.content}</p>)}
              </li>
            ))}
          </ul>
        </ScrollToBottom>
        <div className="message-input">
          <div className="wrap">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={(event) => {
                handleChange(event.fileList)
              }}
            >
              {/* {uploadButton} */}
              {fileList.length > 9 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <input
              className="write-message-input"
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
              className="send-button"
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
