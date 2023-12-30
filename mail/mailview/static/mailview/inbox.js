window.onpopstate = function (event) {
    if (event.state) {
        if (event.state.mailbox === 'compose') {
            loadCompose();
        } else if (event.state.mailbox === 'Inbox' || event.state.mailbox === 'Sent' || event.state.mailbox === 'Archived') {
            loadMailBox(event.state.mailbox);
        }

        if (event.state.mailbox >= '0' && event.state.mailbox <= '9') {
            getAndHandleAPI(parseInt(event.state.mailbox));
        }
    }
}

var hasrun= true;
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#Inbox').onclick = () => {
        history.pushState({ mailbox: 'Inbox' }, "", "inbox");
        loadMailBox('Inbox');
    }
    document.querySelector('#Sent').onclick = () => {
        history.pushState({ mailbox: 'Sent' }, "", "sent");
        loadMailBox('Sent');
    }
    document.querySelector('#Archived').onclick = () => {
        history.pushState({ mailbox: 'Archived' }, "", "archived");
        loadMailBox('Archived');
    }
    document.querySelector('#Compose').onclick = () => {
        history.pushState({ mailbox: 'compose' }, "", "compose");
        loadCompose();
    }

    document.querySelector('#compose-form').onsubmit = function () {
        postToEmail();
        history.pushState({ mailbox: 'Sent' }, "", "sent");
        loadMailBox('Sent');
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        var hour = today.getHours();
        var minute = today.getMinutes();
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




    let observer = new MutationObserver(function () {
        document.querySelectorAll('.mail-link').forEach(mail => {
            mail.onclick = function () {
                detail_showDetail(mail.dataset.mailbox, mail.dataset.id);
            }
        });
    });


    observer.observe(document.body, { childList: true, subtree: true });
});


function loadCompose() {
    document.querySelector('#mailBox').style.display = 'none';
    document.querySelector('#compose').style.display = 'block';
    document.querySelector('#detailview').style.display = 'none';

    document.querySelector('#recipients').value = '';
    document.querySelector('#subject').value = '';
    document.querySelector('#body').value = '';
}

function loadMailBox(mailbox) {

    if (hasrun){
        if (mailbox == "Inbox") {
            history.pushState({ mailbox: 'Inbox' }, "", `inbox`);
        }
        hasrun= false;
    }

    document.querySelector('#mailBox').style.display = 'block';
    document.querySelector('#compose').style.display = 'none';
    document.querySelector('#detailview').style.display = 'none';
    document.querySelector('#mailBox').innerHTML = `<h3 class="mt-3 mb-3">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    mailBox_addEmailToBox(mailbox.toLowerCase());
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

function mailBox_addEmailToBox(mailbox) {
    url = `/emails/${mailbox}`;
    fetch(url)
        .then(response => response.json())
        .then(emails => {
            mailBox_addEmailToHTMLDiv(emails,mailbox);
        })

}

function mailBox_addEmailToHTMLDiv(emails, mailbox) {
    emails.forEach(email => {
        let element = document.createElement('div');
        let sender = email.sender, subject = email.subject, timestamp = email.timestamp, read = email.read;
        let id = email.id;
        element.innerHTML = `<div class="d-flex w-75"> <p style="width: 10%; font-weight: bold; text-align: left;">${sender}</p> <p class="w-50">${subject}</p> </div> <p>${timestamp}</p>`;
        element.className = 'mail-link d-flex justify-content-between border border-dark pt-2 ps-2 pe-2 btn btn-outline-dark';
        if (read) {
            element.classList.add('bg-color');
        }
        element.dataset.id= id;
        element.dataset.mailbox= mailbox;
        document.querySelector('#mailBox').append(element);
    });
}

function detail_showDetail(mailbox, id){
    history.pushState({ mailbox: `${id}` }, "", `${mailbox}%2F${id}`);
    detail_getAndHandleAPI(id);
}

function detail_getAndHandleAPI(id) {
    url = `/emails/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(email => {
            document.querySelector('#compose').style.display = 'none';
            document.querySelector('#mailBox').style.display = 'none';
            document.querySelector('#detailview').style.display = 'block';
            document.querySelector('#detailview').innerHTML = `<h3 class="mt-3 mb-3">Email</h3>`;
            let element = document.createElement('div');
            let sender = email.sender, subject = email.subject,
                timestamp = email.timestamp,
                read = email.read,
                recipients = email.recipients,
                body = email.body;

            element.innerHTML = `<div class="container border-top border-secondary pt-3">
            <div class="d-flex w-100"><p class="frame">From: </p> <p>${sender}</p></div>
            <div class="d-flex w-100"><p class="frame">To: <p>${recipients}</p></div>
            <div class="d-flex w-100"><p class="frame">Subject: </p> <p>${subject}</p></div>
            <div class="d-flex w-100"><p class="frame">Timestamp: </p> <p>${timestamp}</p></div>
            <div><button class="btn btn-outline-primary">Reply</button>
        </div>
        <p class="container border-top border-secondary mt-3 pt-2">${body}</p>`;
            element.className = 'mail-detail';
            document.querySelector('#detailview').append(element);
        })
}
