import apiKeys from './apiKey.js';
class Chatbox {
    
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            
        }

        this.state = false;
        this.messages = [];
        this.arrayids = [];
        
        localStorage.setItem('token', apiKeys.apiKey);
    };

    

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        this.updateChatText(chatbox, textField);
        let query = {model: "gpt-3.5-turbo",messages: [{role: "user", content: text1}]}

        fetch('https://api.openai.com/v1/chat/completions', {
          body: JSON.stringify(query),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        })
          .then(r => r.json())
          .then(data => {
            let msg2;
            if(data.success == false){
                msg2 = { name: "Sam", message: 'We can not process your query at this time.' };
            }
            else{
                var mensaje = data.choices[0].message.content;
                msg2 = { name: "Sam", message: mensaje}; 
            }
            this.messages.push(msg2);
            this.updateChatText(chatbox, textField)

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox, textField)
        });
    }

    updateChatText(chatbox, textField) {
        textField.value = '';
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}
const chatbox = new Chatbox();
chatbox.display();
