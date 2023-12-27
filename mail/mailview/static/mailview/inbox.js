document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#Inbox').onclick = () => loadMailBox('Inbox');
    document.querySelector('#Sent').onclick = () => loadMailBox('Sent');
    document.querySelector('#Archived').onclick = () => loadMailBox('Archived');
    document.querySelector('#Compose').onclick = () => loadCompose();

    document.querySelector('#compose-form').onsubmit = function () {
        postToEmail();
        loadMailBox('Sent');
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = today.getMonth(); // Tháng bắt đầu từ 0
        var yyyy = today.getFullYear();
        var hour= today.getHours();
        var minute= today.getMinutes();
        var ampm = hour >= 12 ? 'PM' : 'AM';
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemper", "October", "November", "December"];

        today = monthNames[mm] + ' ' + dd + ' ' + yyyy + ', ' + hour + ':' + minute + ' ' + ampm;

        let element = document.createElement('div');
        let sender = document.querySelector('#sender').value,
            subject = document.querySelector('#subject').value,
            timestamp = today;
        element.innerHTML = `<div class="d-flex w-75"> <p class="w-25">${sender}</p> <p class="w-50">${subject}</p> </div> <p>${timestamp}</p>`;
        element.className = 'd-flex justify-content-between border border-dark pt-2 ps-2 pe-2';
        document.querySelector('#mailBox').append(element);
        return false;
    }

    loadMailBox('Inbox');
});

function loadCompose() {
    document.querySelector('#mailBox').style.display = 'none';
    document.querySelector('#compose').style.display = 'block';

    document.querySelector('#recipients').value = '';
    document.querySelector('#subject').value = '';
    document.querySelector('#body').value = '';
}

function loadMailBox(mailbox) {
    document.querySelector('#mailBox').style.display = 'block';
    document.querySelector('#compose').style.display = 'none';
    document.querySelector('#mailBox').innerHTML = `<h3 class="mt-3 mb-3">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    addEmailToBox(mailbox.toLowerCase());
}

function postToEmail() {
    let data = {
        recipients: document.querySelector('#recipients').value,
        subject: document.querySelector('#subject').value,
        body: document.querySelector('#body').value
    }
    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch('/emails', option)
}

function addEmailToBox(mailbox) {
    url = `/emails/${mailbox}`;
    fetch(url)
        .then(response => response.json())
        .then(emails => {
            console.log(emails);
            addEmailToHTMLDiv(emails);
        })

}

function addEmailToHTMLDiv(emails) {
    var ParentElement = document.createElement('div');
    ParentElement.className = 'mail-list';
    emails.forEach(email => {
        let element = document.createElement('div');
        let sender = email.sender, subject = email.subject, timestamp = email.timestamp, read = email.read;
        element.innerHTML = `<div class="d-flex w-75"> <p class="w-25">${sender}</p> <p class="w-50">${subject}</p> </div> <p>${timestamp}</p>`;
        element.className = 'd-flex justify-content-between border border-dark pt-2 ps-2 pe-2';
        if (read) {
            element.classList.add('bg-color');
        }
        document.querySelector('#mailBox').append(element);
    });
}