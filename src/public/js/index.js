// Importación de Socket.io y creación de una instancia desde el lado del cliente
const socket = io();

// Variable para guardar el usuario
let user;

const chatBox = document.getElementById("chatBox");
const sendButton = document.getElementById("sendButton");

// Conexión al servidor de sockets
socket.on('connect', () => {
    console.log('Conectado al servidor de sockets');
});

// SweetAlert para el mensaje de bienvenida y autenticación del usuario
Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value;
});

// Función para enviar mensajes
function sendMessage() {
    if(chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value.trim() });
        chatBox.value = "";
    }
}

// Event listener para el envío de mensajes usando Enter
chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        sendMessage();
    }
});

// Event listener para el envío de mensajes usando el botón de envío
sendButton.addEventListener("click", () => {
    sendMessage();
});

// Listener para recibir y mostrar mensajes
socket.on("messagesLogs", data => {
    const log = document.getElementById("messagesLogs");
    let messages = "";

    if (Array.isArray(data)) {
        data.forEach(message => {
            messages += `${message.user} dice: ${message.message} <br>`;
        });
    } else {
        console.error("Los datos recibidos no son un array:", data);
    }

    log.innerHTML = messages;
});
