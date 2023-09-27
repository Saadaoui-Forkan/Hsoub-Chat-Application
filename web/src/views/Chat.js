import React, { Component } from 'react'
import ContactHeader from '../components/chat/ContactHeader'
import { Row, Spinner } from 'reactstrap';
import Contacts from '../components/chat/Contacts';
import ChatHeader from '../components/chat/ChatHeader';
import Messages from '../components/chat/Messages';
import MessageForm from '../components/chat/MessageForm';

// Implementing socketIo Client
import socketIO from 'socket.io-client'; 

export default class Chat extends Component {
  state = {
    user: { id: "1", name: "عبدالله" },
    message: [
      { sender: "1", receiver: "2", content: "ككيف حالك" },
      { sender: "1", receiver: "2", content: "ككيف حالك" },
      { sender: "3", receiver: "1", content: "ككيف حالك" },
      { sender: "1", receiver: "3", content: "ككيف حالك" },
      { sender: "1", receiver: "2", content: "ككيف حالك" },
      { sender: "3", receiver: "2", content: "ككيف حالك" },
      { sender: "2", receiver: "1", content: "ككيف حالك" },
    ],
    contacts: [
      { id: "2", name: "محمد" },
      { id: "3", name: "أحمد" },
    ]
    , contact: { id: "3", name: "أحمد" },
  }

  onChatNavigate = contact => {
    this.setState({contact})   
  }

  componentDidMount(){
      this.initSocketConnection();
  }

  render() {
    if(!this.state.connected){
      return <Spinner id="loader" color="success" />
    }

    return (
      <Row className="h-100">
        <div id="contacts-section" className="col-4 col-md-4">
          <ContactHeader />
          <Contacts 
            contacts={this.state.contacts} 
            messages={this.state.message}
            onChatNavigate={this.onChatNavigate}
          />
        </div>
        <div id="messages-section" className="col-8 col-md-8">
          <ChatHeader contact={this.state.contact} />
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
