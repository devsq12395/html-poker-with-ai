// Define the API endpoint and API key
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="
const API_KEY = 'AIzaSyDRtXsqmZZ8DVxxkz-CAOSjYpzqJqvRjc4';

// Array to store conversation history
let conversations = [];

// DOM elements
const chatTxt = document.querySelector('.chatbox-txt');
const inputTxt = document.querySelector('#user-input');
const btnSend = document.querySelector('#btn-send');

// Function to send message to Cohere API for completion
const sendMessage = async (msg) => {
  try { console.log (`${API_URL}${API_KEY}`);
    const response = await fetch(`${API_URL}${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: {
            role: "user",
            parts: {
                text: msg.content
            }
        }
      })
    });

    const data = await response.json(); console.log (data);
    const responseMessage = `ChatGPT: ${data.candidates[0].content.parts[0].text}<br>`;
    const msgToAdd = `You: ${msg.content}<br>${responseMessage}`;

    // Update conversation history
    conversations.push(msgToAdd);

    // Update chat display
    chatTxt.innerHTML += msgToAdd;
  } catch (error) {
    console.error('Error:', error.message);
    // Handle error here
  }
}

const testMessage = `User
Let's play poker

Current action:
Betting size is 1 SB / 2 BB
You are in SB with 98 chips
Your hand is Qc Kc
Villain in BB with 102 chips
Villain puts mandatory BB for 2 chips (Villain cur chip: 100, Pot: 2)
You raised to 6 chips (You cur chip: 92, Pot: 8)
Villain calls, putting 4 more chips (Villain cur chip: 96, Pot: 12)
Flop is 2c Ad Jc
You check
Villain bets 4 chips (Villain cur chip: 92, Pot: 16)
You raised to 10 chips (You cur chip: 82, Pot 26)
Villain calls, putting 6 more chips (Villain cur chip: 90, Pot: 32)
Turn is As
You check
Villain check
River is 5d
You check
Villain bets 10 chips (Villain cur chip: 80, Pot: 42)

You will only reply with any of your current options:
CALL
RAISE [SIZE]
FOLD

Example reply:
BET 50`;

// Event listener for sending messages
btnSend.addEventListener('click', () => {
  const newMessage = {
    role: 'user',
    content: testMessage
  };

  sendMessage(newMessage);
});
