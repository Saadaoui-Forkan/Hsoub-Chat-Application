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

export default class Chat extends Component {
  state = {}

  onChatNavigate = contact => {
    this.setState({contact})   
  }

  componentDidMount(){
      this.initSocketConnection();
  }

  // Init Socket
  initSocketConnection = () => {
    let socket = socketIO(process.env.REACT__SOCKET, {
        query: 'token =' + Auth.getToken(),
    })

    socket.on('connect', () => this.setState({connected: true}))

    socket.on('disconnect', () => this.setState({connected: false}))

    socket.on("data", (user, contacts, messages) => {
      let contact = contacts[0] || {};
      this.setState({ messages, contacts, user, contact }, () => {
        this.setState(messages, contacts, user, contact);
      })
    })

    socket.on( "error", (err) => {
      if (err === "auth_error") {
        Auth.logout();
        this.props.history.push("/login");
      }
    })
    
};

  render() {
    if(!this.state.connected || !this.state.contacts || !this.state.messages){
      return <Spinner id="loader" color="success" />
    }

    return (
      <Row className="h-100">
        <div id="contacts-section" className="col-4 col-md-4">
          <ContactHeader />
          <Contacts 
            contacts={this.state.contacts} 
            messages={this.state.messages}
            onChatNavigate={this.onChatNavigate}
          />
        </div>
        <div id="messages-section" className="col-8 col-md-8">
          <ChatHeader 
            contact={this.state.contact} 
          />
					{this.renderChat()}
					<MessageForm />
        </div>
      </Row>
    );
  }
  renderChat = () => {
		const { contact, user } = this.state;
		if (!contact) return;
		let messages = this.state.message.filter(e => e.sender === contact.id || e.receiver === contact.id)
		return <Messages user={user} messages={messages} />
	}
}
