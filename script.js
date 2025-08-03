import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwvezIWETFD1U9fWudKG6INAheDng_SWM",
  authDomain: "appointment-site-b2e70.firebaseapp.com",
  projectId: "appointment-site-b2e70",
  storageBucket: "appointment-site-b2e70.appspot.com",
  messagingSenderId: "1064981156953",
  appId: "1:1064981156953:web:6c26ad5e3a7155e8e1cd48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const form = document.getElementById("appointmentForm");
const statusMessage = document.getElementById("statusMessage");

// On form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const time = form.time.value;
  const photoFile = form.photo.files[0];

  if (!name || !email || !time) {
    alert("Name, Email, and Time are required.");
    return;
  }

  statusMessage.textContent = "Submitting...";

  let photoUrl = null;

  if (photoFile) {
    const storageRef = ref(storage, `photos/${Date.now()}-${photoFile.name}`);
    await uploadBytes(storageRef, photoFile);
    photoUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "appointments"), {
    name,
    email,
    time,
    photoUrl,
    status: "pending",
  });

  localStorage.setItem("userEmail", email);
  statusMessage.textContent = "Your request is submitted!";
  form.reset();
});

// On load, check for existing approval
window.addEventListener("load", async () => {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  const q = query(collection(db, "appointments"), where("email", "==", email));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.status === "approved") {
      statusMessage.textContent = "✅ Your request is accepted by admin!";
    } else {
      statusMessage.textContent = "🕐 Your request is pending approval.";
    }
  });
});
