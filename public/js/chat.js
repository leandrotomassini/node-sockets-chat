
let usaurio = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const btnSalir = document.querySelector('#btnSalir');
const ulMensajes = document.querySelector('#ulMensajes');



const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('Token no válido.')
    }

    const resp = await fetch('http://localhost:8080/api/auth/', {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    document.title = usuario.nombre;

    await conectarSocket();
}


const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', (payload) => {
        dibujarUsuarios(payload);
    });

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload);
    });

}

const dibujarUsuarios = (usuarios) => {

    let usersHtml = '';

    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>`;
    });

    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes) => {

    let mensajesHTML = '';

    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHTML += `
        <li>
            <p>
                <span class="text-primary">${nombre}:</span>
                <span>${mensaje}</span>
            </p>
        </li>`;
    });

    ulMensajes.innerHTML = mensajesHTML;
}


txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) {
        return;
    }

    if (mensaje.length === 0) {
        return;
    }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';
});

const main = async () => {

    // Validar JWT
    await validarJWT();
}


main();









