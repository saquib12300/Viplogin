// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Toggle custom hours input
document.getElementById('expirySelect').addEventListener('change', function() {
    document.getElementById('customHours').style.display = this.value === "1h" ? "block" : "none";
});

// Generate Key
function generateKey() {
    let key = document.getElementById('keyInput').value;
    let expiry = document.getElementById('expirySelect').value;
    let customHours = document.getElementById('customHours').value;

    if (!key) return alert("Enter a key!");

    let expirationTime = Date.now();
    if (expiry === "1h" && customHours) {
        expirationTime += customHours * 60 * 60 * 1000; 
    } else {
        const timeMap = { "1d": 24, "3d": 72, "7d": 168, "30d": 720 };
        expirationTime += timeMap[expiry] * 60 * 60 * 1000;
    }

    let devID = Math.random().toString(36).substring(2, 8);
    let keyData = { key, devID, status: "Not Used", expiresAt: expirationTime };

    db.ref('keys/' + key).set(keyData).then(() => {
        alert("Key Generated Successfully!");
        document.getElementById('keyInput').value = "";
    });
}

// Load Keys
function loadKeys() {
    db.ref('keys').on('value', snapshot => {
        let keyList = document.getElementById('keyList');
        keyList.innerHTML = "";
        snapshot.forEach(child => {
            let data = child.val();
            let statusColor = data.status === "Active" ? "text-green-400" 
                              : data.status === "Expired" ? "text-red-400" 
                              : "text-yellow-400";

            keyList.innerHTML += `
                <div class="bg-purple-800 p-4 m-2 rounded-lg shadow-lg text-white w-1/2 flex justify-between">
                    <span>ID: ${child.key}</span>
                    <span>Key: ${data.key}</span>
                    <span>Dev ID: ${data.devID}</span>
                    <span class="${statusColor}">${data.status}</span>
                    <button onclick="copyKey('${data.key}')" class="bg-blue-500 px-2 py-1 rounded-lg">Copy</button>
                    <button onclick="deleteKey('${child.key}')" class="bg-red-500 px-2 py-1 rounded-lg">Delete</button>
                </div>`;
        });
    });
}

// Delete Key
function deleteKey(key) {
    db.ref('keys/' + key).remove().then(() => {
        alert("Key Deleted!");
    });
}

// Copy Key
function copyKey(key) {
    navigator.clipboard.writeText(key);
    alert("Key Copied!");
}

// Search Key
function searchKey() {
    let searchVal = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll("#keyList div").forEach(div => {
        div.style.display = div.innerText.toLowerCase().includes(searchVal) ? "block" : "none";
    });
}

loadKeys();
