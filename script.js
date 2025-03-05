const firebaseConfig = {
    apiKey: "AIzaSyD89CQpILmaxVdH-X7L-Ex4rW-XIBA3vHU",
    authDomain: "webai-b6629.firebaseapp.com",
    databaseURL: "https://webai-b6629-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "webai-b6629",
    storageBucket: "webai-b6629.firebasestorage.app",
    messagingSenderId: "358930931757",
    appId: "1:358930931757:web:ed7b1ab7274bbdb3b7d8a4"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
}

function showSection(section) {
    document.getElementById('generateKey').classList.add('hidden');
    document.getElementById('manageKeys').classList.add('hidden');
    document.getElementById(section).classList.remove('hidden');
}

function toggleDropdown() {
    document.getElementById('dropdown').classList.toggle('hidden');
}

function selectOption(option) {
    document.getElementById('selectedOption').textContent = option;
    document.getElementById('dropdown').classList.add('hidden');

    if (option === '1 Hour') {
        document.getElementById('hourInput').classList.remove('hidden');
    } else {
        document.getElementById('hourInput').classList.add('hidden');
    }
}

function generateKey() {
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 7; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("generatedKey").value = key;
    
    let duration = document.getElementById("selectedOption").textContent;
    let expiration = new Date();
    if (duration.includes("Hour")) {
        let hours = parseInt(document.getElementById("hourInput").value);
        expiration.setHours(expiration.getHours() + hours);
    } else {
        let days = parseInt(duration);
        expiration.setDate(expiration.getDate() + days);
    }

    let deviceID = generateDeviceID();
    db.ref("keys").push({
        key: key,
        deviceID: deviceID,
        status: "Active",
        expiresAt: expiration.toISOString()
    });

    alert("Key Saved!");
}

function generateDeviceID() {
    let chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    let id = "";
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
