# 🐮 Jawline Adich Poyi – Cow Chewing Mood Detector

*"Chew cheyyunna Mood Detector! – A fun mix of cows, mood tracking, Malayalam humor, and IoT."*

## 📜 Overview

**Jawline Adich Poyi** is an IoT + Web App project that detects a cow's "chewing activity" and "nearby human presence", then visualizes the cow's **mood** on a colorful, animated website with Malayalam-themed fun elements.

The project consists of:

1. **ESP32 + MPU6050 + Ultrasonic Sensor** – Detects chewing rate (via yaw movement) & human presence.
2. **Firebase Realtime Database** – Stores live chewing count, yaw data, and motion detection status.
3. **Web Dashboard** – Displays live mood changes, plays fun videos, reacts to human presence, and plots chewing stats.

---

## 🛠 Hardware Requirements

* **ESP32** (WiFi-enabled microcontroller)
* **MPU6050** Accelerometer + Gyroscope
* **HC-SR04** Ultrasonic Distance Sensor
* Breadboard + Jumper wires
* Stable WiFi connection

---

## 📂 Project Structure

```
├── arduino/
│   └── cow_mood_detector.ino   # ESP32 firmware code
├── web/
│   ├── index.html               # Frontend HTML
│   ├── style.css                # Styling & animations
│   ├── app.js                   # Firebase config & init
│   ├── script.js                # Mood detection & chart logic
│   └── vids/                    # Fun cow videos (happy, sad, neutral, dialogue)
└── README.md                    # This file
```

---

## ⚙ Arduino (ESP32) Logic

### **1. WiFi Setup**

```cpp
WiFi.begin(ssid, password);
while (WiFi.status() != WL_CONNECTED) { ... }
```

* Connects to your WiFi network.
* Required for Firebase data push.

### **2. Firebase Initialization**

```cpp
config.host = FIREBASE_HOST;
config.signer.tokens.legacy_token = FIREBASE_AUTH;
Firebase.begin(&config, &auth);
```

* Connects ESP32 to your **Firebase Realtime Database**.
* Sends chewing count, yaw angle, and motion detection flag.

### **3. MPU6050 Reading**

* Reads accelerometer & gyroscope data.
* Extracts **yaw rate** to detect chewing.
* Uses:

```cpp
Yaw_angle += (Yaw_rate * dt / 1000.0);
Yaw_angle = map(Yaw_angle, -32768, 32767, 0, 360);
```

### **4. Ultrasonic Sensor**

* Detects human presence in range **10–50 cm**. 
* Sets `motion_detected = true` if a human is detected.

### **5. Firebase Upload**

Example upload:

```cpp
Firebase.setFloat(firebaseData, "/MPU6050/Count", count);
Firebase.setBool(firebaseData, "/Ultrasonic/motion_detected", motion_detected);
```

---

## 🌐 Web Dashboard Logic

### **1. Firebase Setup (`app.js`)**

```javascript
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
```

* Uses Firebase v9 modular SDK.
* Connects frontend to the same DB as ESP32.

### **2. Live Mood Detection (`script.js`)**

* Fetches `Count` & `RealTime` from DB every **10 seconds**.
* Calculates **chews per minute**:

```javascript
const chewRate = (count - lastCount) / (time - lastTime);
```

* Mood thresholds:

  * **Happy**: ≥ 0.5 chews/sec
  * **Neutral**: ≥ 0.2 chews/sec
  * **Sad**: otherwise
* Updates:

  * Mood status text
  * Video (happy, neutral, sad)
  * Chart.js chewing graph

### **3. Human Detection Reaction**

* Listens to `/Ultrasonic/motion_detected`.
* If `true`, plays special **cow dialogue** video.
* Cooldown: 5 seconds between detections.

### **4. Animations**

* **GSAP** animations on page load & scroll.
* **Chart.js** for live graphing.
* Hero section cow GIF wiggles infinitely.

---

## 🎨 UI/UX Highlights

* **Navbar** with smooth scroll.
* **Hero Section** with animated cow GIF.
* **Mood Section** with live status, video, and chew count.
* **Reaction Section** triggered by human detection.
* **Stats Section** with a live updating chewing chart.
* **Gallery** of all moods.
* Malayalam humor sprinkled throughout.

---

## 🔌 Wiring Guide

| ESP32 Pin | Component Pin | Description        |
| --------- | ------------- | ------------------ |
| 21 (SDA)  | MPU6050 SDA   | I2C Data Line      |
| 22 (SCL)  | MPU6050 SCL   | I2C Clock Line     |
| 33        | HC-SR04 TRIG  | Trigger Ultrasonic |
| 32        | HC-SR04 ECHO  | Echo Ultrasonic    |
| 3.3V      | VCC (both)    | Power Supply       |
| GND       | GND (both)    | Ground             |

---

## 🔥 Firebase Database Structure

```
{
  "MPU6050": {
    "Count": 12,
    "RealTime": 1053.08398,
    "Yaw": 181
  },
  "Ultrasonic": {
    "motion_detected": false
  }
}
```

---

## 🚀 Deployment

1. **Arduino Side**

   * Install Arduino IDE
   * Install:

     * `FirebaseESP32` library
     * `Wire.h` (built-in)
   * Upload `.ino` to ESP32.

2. **Firebase**

   * Create project in Firebase Console.
   * Enable **Realtime Database**.
   * Set database rules to allow read/write (or secure as needed).
   * Update credentials in `cow_mood_detector.ino` & `app.js`.

3. **Frontend**

   * Place `index.html`, `style.css`, `app.js`, `script.js` in hosting folder.
   * Upload to:

     * GitHub Pages
     * Firebase Hosting
     * Any static site host.


---

## 📸 Screenshots / Demo

*(Add GIFs and screenshots of mood changes & human detection reactions here)*

---

## 🐄 Credits

Created with ❤️ in Kerala.
Mixing **Electronics + Web Dev + Malayalam humor** for fun and learning.

---

If you want, I can also prepare a **GitHub-ready version with badges, images, and deploy instructions** so that it looks professional and attractive for your repo.
Do you want me to do that?
