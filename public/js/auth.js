
const miFormulario = document.querySelector('form');


miFormulario.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {

            if (msg) {
                return console.error(msg);
            }

            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => {
            console.log(err);
        })

});


function handleCredentialResponse(response) {

    // console.log('Google Token: ', response.credential);
    const body = { id_token: response.credential };

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const button = document.getElementById('google_signout');

button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}