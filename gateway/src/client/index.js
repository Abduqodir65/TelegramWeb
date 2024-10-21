const open = document.getElementById('open');
const close = document.getElementById('close');
const modal_container = document.getElementById('modal_container');

const open_settings = document.getElementById('open_settings');
const close_settings = document.getElementById('close_settings');
const settings_container = document.getElementById('settings-container');

// Asosiy chat elementlari
const mainChatName = document.querySelector('.chat-header-text h2');
const mainChatImage = document.querySelector('.chat-header img');
const verified = document.querySelector('#verified')

// Modal ochish va yopish funksiyalari
open.addEventListener('click', () => {
    modal_container.classList.add('show');
});
close.addEventListener('click', () => {
    modal_container.classList.remove('show');
});

open_settings.addEventListener('click', () => {
    settings_container.classList.add('show');
});

close_settings.addEventListener('click', () => {
    settings_container.classList.remove('show');
});

// Kontaktni localStorage ga saqlash funksiyasi
function saveContact(name, phone, image) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push({ name, phone, image });
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// localStorage dan kontaktlarni yuklash funksiyasi
function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.forEach(contact => {
        addChatItem(contact.name, contact.phone, contact.image);
    });
}

// Yangi chat element qo'shish funksiyasi
function addChatItem(name, phone, image) {
    const newChatItem = document.createElement('div');
    newChatItem.classList.add('chat-item');

    const images = [
        './images/abdulhodiy.jpg',
        './images/durov.jpg',
        './images/nature.jpg',
        './images/ahmad_aka.jpg',
        './images/mountain.jpg'
    ];

    // Tasodifiy rasm tanlash yoki oldindan saqlanganini olish
    let randomImage = image || images[Math.floor(Math.random() * images.length)];
    // LocalStorage'dan rasmni tekshirish va olish
    let savedImage = localStorage.getItem(name + '_image');
    if (savedImage) {
        randomImage = savedImage; // Agar saqlangan rasm bo'lsa, uni ishlatamiz
    } else {
        localStorage.setItem(name + '_image', randomImage); // Rasmni saqlaymiz
    }

    console.log('Image being used:', randomImage); // Rasm manzilini konsolga chiqaramiz

    newChatItem.innerHTML = `
        <img src="${randomImage}" alt="New Contact" class="chat-icon">
        <div class="chat-info">
            <p class="chat-name">${name}</p>
            <p class="chat-last-message">New contact added</p>
        </div>
        <div class="wrapper-delete"> 
            <div class="chat-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <button class="delete-contact" style="border:none;background-color:transparent;cursor:pointer;">🗑️</button>
        </div>
    `;

    const deleteButton = newChatItem.querySelector('.delete-contact');
    deleteButton.addEventListener('click', () => {
        newChatItem.remove();
        removeContactFromStorage(name); // localStorage dan o'chirish
        localStorage.removeItem(name + '_image'); // Rasmini ham o'chirish
    });

    // Kontakt ustiga bosilganda asosiy chatga ma'lumotlarni chiqarish
    newChatItem.addEventListener('click', () => {
        // Eski chat body ni tozalash
        const chatBody = document.querySelector('.chat-body');
        chatBody.innerHTML = `
            <div class="chat-body-start-message">
                <h4>No message here yet...</h4>
                <p>Send a message or click on the greeting below </p>
                <div class="gif"></div>
            </div>
        `; // default xabar

        // Kontakt ismini yangilash
        mainChatName.textContent = name;
        verified.remove()
    });

    document.querySelector('.chat-list').appendChild(newChatItem);
}

// Kontaktni localStorage dan o'chirish
function removeContactFromStorage(name) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const updatedContacts = contacts.filter(contact => contact.name !== name);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
}

// Form yuborilganda yangi kontaktni qo'shish
document.getElementById('addContactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    addChatItem(name, phone);

    // Kontaktni localStorage ga saqlash
    saveContact(name, phone);

    // Modalni yopish va formni tozalash
    modal_container.classList.remove('show');
    document.getElementById('addContactForm').reset();
});

// Sahifa yuklanganda kontaktlarni localStorage dan yuklash
document.addEventListener('DOMContentLoaded', function () {
    loadContacts();
});


const messageInput = document.querySelector('.message-input');
const chatBody = document.querySelector('.chat-body');

messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && messageInput.value.trim() !== '') {
        // Xabar uchun element yaratish
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');

        // Xabar vaqtini olish
        const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        newMessage.innerHTML = `
                <div class="message-content">
                    <p>${messageInput.value}</p>
                    <div class="message-time">${messageTime}</div>
                </div>
            `;

        // Yaratilgan xabarni chat-bodyga qo'shish
        chatBody.appendChild(newMessage);

        // Yozilgan xabarni tozalash
        messageInput.value = '';

        // No message matnini yashirish
        const startMessage = document.querySelector('.chat-body-start-message');
        if (startMessage) {
            startMessage.style.display = 'none';
        }

        // Skrollni oxiriga tushirish
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});


