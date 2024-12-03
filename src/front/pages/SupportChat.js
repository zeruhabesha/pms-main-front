import React, { useState } from 'react';
import emailjs from 'emailjs-com'; // Import EmailJS

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Function to toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to send email with EmailJS
  const sendEmail = (messageContent) => {
    const templateParams = {
      user_email: 'zeruhabesha09@gmail.com', // Send the chat to this email
      message: messageContent,
    };

    // Send the email using emailjs
    emailjs.send(
      'YOUR_SERVICE_ID',     // Replace with your EmailJS Service ID
      'YOUR_TEMPLATE_ID',    // Replace with your EmailJS Template ID
      templateParams,
      'YOUR_USER_ID'         // Replace with your EmailJS User ID
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
      console.error('FAILED...', error);
    });
  };

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { sender: 'You', message };
      setChatHistory([...chatHistory, newMessage]);
      setMessage('');

      // Send the email when the message is sent
      sendEmail(newMessage.message);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {/* Chat toggle button with online status indicator */}
      <div style={{ position: 'relative' }}>
        {/* Online green dot */}
        <div 
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '12px',
            height: '12px',
            backgroundColor: 'green', // Green color for "online" status
            borderRadius: '50%',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
          }}
        />
        {/* Chat toggle button */}
        <button 
          onClick={toggleChat} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '50px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
          }}
        >
          {isOpen ? 'Close Chat' : 'Support Chat'}
        </button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div style={{ 
          width: '320px', 
          height: '420px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '10px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Chat history area */}
          <div style={{ 
            padding: '15px', 
            flex: 1, 
            overflowY: 'scroll', 
            borderBottom: '1px solid #ddd' 
          }}>
            {chatHistory.length ? (
              chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  style={{
                    display: 'flex', 
                    justifyContent: chat.sender === 'You' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                  }}
                >
                  <div 
                    style={{ 
                      backgroundColor: chat.sender === 'You' ? '#007bff' : '#e9ecef', 
                      color: chat.sender === 'You' ? '#fff' : '#000',
                      padding: '10px 15px',
                      borderRadius: '20px',
                      maxWidth: '80%',
                      wordWrap: 'break-word'
                    }}
                  >
                    <strong>{chat.sender}</strong>: {chat.message}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#888' }}>No messages yet.</p>
            )}
          </div>

          {/* Message input area */}
          <div style={{ padding: '10px', display: 'flex', borderTop: '1px solid #ddd' }}>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '5px',
                marginRight: '10px' 
              }}
              placeholder="Type your message..."
            />
            <button 
              onClick={handleSendMessage} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChat;
