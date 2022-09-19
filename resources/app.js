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

        fetch('http://localhost:3000/api/questions/getbyapi', {
          body: JSON.stringify({ codigoapi: "88121129400", texto: text1 }),
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then(r => r.json())
          .then(async r => {
            let msg2;
            if(r == null){
                msg2 = { name: "Sam", message: '<p>No estoy muy seguro de lo que desea, puede seleccionar una de estas opciones o intentar nuevamente con textos mas especificos.</p></br><p><a href="#" id="link1" >Billing</a></p> </br> <p><a href="#" id="link2" >Account Management</a></p>' };
            }
            else{
                var mensaje = '<p></br></p>';
                const printPreguntas = async () => {
                     const a = await this.getPreguntasAsociadas(r.answerid);
                     
                    for (let i=0; i<a.length; i++ ){  
                        mensaje += '<p><a href="#" id="pregaso'+a[i].questionid+'">'+a[i].textopregunta+'</a></p></br>';
                        let idsmap = {id : "pregaso"+a[i].questionid, texto : a[i].textopregunta};
                        this.arrayids.findIndex(x => x.id == idsmap.id) == -1 ? this.arrayids.push(idsmap): console.log("Object already exists");
                        
                    } 
                    mensaje = r.textorespuesta + mensaje;
                    return mensaje;
                };
                mensaje = await printPreguntas();
                
                // var arr = this.getPreguntasAsociadas(r.answerid);
                // console.log(arr);

                // var mensaje = '</br>';
                // for (let i=0; i<arr.length; i++ ){
                //     console.log(i);
                //     mensaje += '<p><a href="#" id="pregaso"'+arr[i].questionid+'>Billing</a></p></br>'
                // }
                
                msg2 = { name: "Sam", message: mensaje }; 
            }
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    getPreguntasAsociadas(answerid){
        return fetch('http://localhost:3000/api/preguntasasociadasController/getAll', {
          body: JSON.stringify({ answerid: answerid }),
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(r =>  r.json())
        .then(response => {
            return response;
        })
        .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            //textField.value = ''
        });
    }

    //falta automatizar la traida de los items del menu, ya se creo la tabla itemmenu en postgres
    onSendTextToButton(chatbox,texto){
        let text1 = texto;
        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://localhost:3000/api/questions/getbyapi', {
          body: JSON.stringify({ codigoapi: "88121129400", texto: text1 }),
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then(r => r.json())
          .then(r => {
            let msg2;
            if(r == null){
                msg2 = { name: "Sam", message: '<p>No estoy muy seguro de lo que desea, puede seleccionar una de estas opciones o intentar nuevamente con textos mas especificos.</p></br><p><a href="#" id="link1" >Billing</a></p> </br> <p><a href="#" id="link2" >Account Management</a></p>' };
            }
            else{
                msg2 = { name: "Sam", message: r.textorespuesta };
                this.getPreguntasAsociadas(r.answerid);                
            }
                
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            //textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            //textField.value = ''
          });
    }

    updateChatText(chatbox) {
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
        let el, el2 = null;
        el = document.getElementById("link1");
        el2 = document.getElementById("link2");
        if(el === null && el === undefined )
        {
            console.log(el);
            el.addEventListener('click', function() {
                console.log('hello');
            });
        }
        if(el2 !== null && el2 !== undefined )
            el2.addEventListener('click', () => this.onSendTextToButton(chatbox,"account management"));
        
        if(this.arrayids.length>0){
            console.log(this.arrayids.length);
            for(let i=0; i<this.arrayids.length; i++){
                console.log(this.arrayids[i].id);
                document.getElementById(this.arrayids[i].id).addEventListener('click', () => this.onSendTextToButton(chatbox, this.arrayids[i].texto));
            }
            //this.arrayids = [];
        }
    }
}
const chatbox = new Chatbox();
chatbox.display();

/**falta la automatizacion de la respuesta no reconocida para
 que muestre el menu automatico al igual que las preguntas 
 asociadas. */