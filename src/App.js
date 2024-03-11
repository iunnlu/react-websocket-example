import React from 'react';
import SockJsClient from 'react-stomp';

const SOCKET_URL = 'http://localhost:8080/web-socket';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'This is my message.',
      connectionStatus: 'NONE',
      messages: [],
      clientId: 'User123',
      serverId: 'AI123',
      inputText: ''
    };
  }

  sendMessage = (msg) => {
    this.state.messages.push({detail: msg, senderUserId: this.state.clientId, receiverUserId: this.state.serverId})
    this.clientRef.sendMessage('/app/message', JSON.stringify(this.state.messages));
  }

  onConnected = () => {
    console.log("Connected!!")
  }

  onMessageReceived = (messages) => {
    this.setState({messages: messages})
  }

  handleInputChange = (event) => {
    this.setState({inputText: event.target.value});
  };

  render() {
    return (
      <div>
        <SockJsClient
          url={SOCKET_URL}
          topics={['/topic/message']}
          ref={ (client) => { this.clientRef = client }}
          onConnect={() => this.setState({connectionStatus: 'CONNECTED'})}
          onDisconnect={() => this.setState({connectionStatus: 'DISCONNECTED'})}
          onMessage={messages => this.onMessageReceived(messages)}
          debug={false}
        />
        {this.state.messages.map((message, index) => (
          <div key={index}>
            <p>Sender User ID: {message.senderUserId}</p>
            <p>{message.detail}</p>
          </div>
        ))}
        <div>Connection Status: {this.state.connectionStatus}</div>
        <input type="text" id="inputText" value={this.state.inputText} onChange={this.handleInputChange}/>
        <button onClick={() => this.sendMessage(this.state.inputText)}>Send Message</button>
      </div>
    );
  }
}

export default App;
