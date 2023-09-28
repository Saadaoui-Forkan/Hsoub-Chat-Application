import React, { Component } from 'react';
import ContactHeader from '../components/chat/ContactHeader';
import Contacts from '../components/chat/Contacts';
import ChatHeader from '../components/chat/ChatHeader';
import Messages from '../components/chat/Messages';
import MessageForm from '../components/chat/MessageForm';
import Auth from '../Auth';
import { Row, Spinner } from 'reactstrap';

// Implementing socketIo Client
import socketIO from 'socket.io-client'; 
import UserProfile from '../components/side/UserProfile';

export default class Chat extends Component {
  state = {
    contacts: [],
    contact: {},
    userProfile: false,
  };

  componentDidMount() {
    this.initSocketConnection();
  }

  // Navigation between chats
  onChatNavigate = (contact) => {
    this.setState({ contact });

    this.state.socket.emit("seen", contact.id);

    let messages = this.state.messages;
    messages.forEach((element, index) => {
      if (element.sender === contact.id) messages[index].seen = true;
    });
    this.setState({ messages });
  };

  // sendMessage = (message) => {
  //   if (!this.state.contact.id) return;
  //   message.receiver = this.state.contact.id;
  //   let messages = this.state.messages.concat(message);
  //   this.setState({ messages });
  //   this.state.socket.emit("message", message);
  // };

  // sendType = () => this.state.socket.emit("typing", this.state.contact.id);

  //  Toggle Profile
  userProfileToggle = () => {
    this.setState({userProfile: !this.state.userProfile})
  }

  render() {
    if (!this.state.connected || !this.state.contacts || !this.state.messages) {
      return <Spinner id="loader" color="danger" />;
      // console.log("first");
    }

    return (
      <Row className="h-100">
        <div id="contacts-section" className="col-4 col-md-4">
          <ContactHeader user={this.state.user} />
          <Contacts
            contacts={this.state.contacts}
            messages={this.state.messages}
            onChatNavigate={this.onChatNavigate}
          />
          <UserProfile
            contact={this.state.contact}
            toggle={this.userProfileToggle}
          />
        </div>
        <div id="messages-section" className="col-8 col-md-8">
          <ChatHeader 
            contact={this.state.contact} 
            typing={this.state.typing} 
            toggle={this.userProfileToggle}
          />
          {this.renderChat()}
          <MessageForm sender={this.sendMessage} sendType={this.sendType} />
        </div>
      </Row>
    );
  }

  renderChat = () => {
    const { contact, user } = this.state;
    if (!contact) return;
    let messages = this.state.message.filter(
      (e) => e.sender === contact.id || e.receiver === contact.id
    );
    return <Messages user={user} messages={messages} />;
  };

  // Init Socket
  initSocketConnection = () => {
    let socket = socketIO(process.env.REACT__SOCKET, {
      query: "token =" + Auth.getToken(),
    });

    socket.on("connect", () => this.setState({ connected: true }));

    socket.on("disconnect", () => this.setState({ connected: false }));

    socket.on("data", (user, contacts, messages, users) => {
      let contact = contacts[0] || {};
      this.setState({ messages, contacts, user, contact }, () => {
        this.updateUsersState(users);
      });
    });

    socket.on("new_user", (user) => {
      let contacts = this.state.contacts.concat(user);
      this.setState({ contacts });
    });

    socket.on("message", (message) => {
      if (message.sender === this.state.contact.id) {
        this.setState({ typing: false });
        this.state.socket.emit("seen", this.state.contact.id);
        message.seen = true;
      }
      let messages = this.state.messages.concat(message);
      this.setState({ messages });
    });

    socket.on("user_status", (users) => {
      let contacts = this.state.contacts;
      contacts.forEach((element, index) => {
        if (users[element.id]) contacts[index].status = users[element.id];
      });
      this.setState({ contacts });
      let contact = this.state.contact;
      if (users[contact.id]) {
        contact.status = users[contact.id];
      }
      this.setState({ contact });
    });

    socket.on("typing", (sender) => {
      if (this.state.contact.id !== sender) return;
      this.setState({ typing: sender });
      clearTimeout(this.state.timeout);
      // hide writing status after 3s
      const timeout = setTimeout(this.typingTimeout, 3000);
      this.setState({ timeout });
    });

    socket.on("error", (err) => {
      if (err === "auth_error") {
        Auth.logout();
        this.props.history.push("/login");
      }
    });
    this.setState({ socket });
  };

  typingTimeout = () => this.setState({ typing: false });

  sendMessage = (message) => {
    if (!this.state.contact.id) return;
    message.receiver = this.state.contact.id;
    let messages = this.state.messages.concat(message);
    this.setState({ messages });
    this.state.socket.emit("message", message);
  };

  sendType = () => this.state.socket.emit('typing', this.state.contact.id);
}
