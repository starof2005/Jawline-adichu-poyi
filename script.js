// script.js - Mood detection, chart & motion detection
import { db } from "./app.js";
import { ref, get, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// DOM elements
const moodVideo = document.getElementById("mood-video");
const moodStatus = document.getElementById("mood-status");
const chewCountEl = document.getElementById("chew-count");

// Video paths
const videos = {
    happy: "vids/happymood.mp4",
    neutral: "vids/neutralmood.mp4",
    sad: "vids/sadmood.mp4",
    dialogue: "vids/cowdialogue.mp4"
};

// GSAP animations
window.addEventListener("load", () => {
    gsap.from(".navbar", { y: -80, opacity: 0, duration: 1, ease: "bounce" });
    gsap.from(".hero h2", { y: 50, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from(".hero p", { y: 50, opacity: 0, duration: 1, delay: 0.7 });
    gsap.from(".cow-hero", { scale: 0, duration: 1, delay: 1 });
    gsap.from(".mood-info", { x: -100, opacity: 0, duration: 1, scrollTrigger: "#mood" });
});

// Chart.js setup
const ctx = document.getElementById("chewChart").getContext("2d");
const chewChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Chews per Minute",
            data: [],
            backgroundColor: "rgba(34,197,94,0.2)",
            borderColor: "rgba(34,197,94,1)",
            borderWidth: 2,
            tension: 0.3
        }]
    },
    options: { responsive: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
});

// Mood calculation vars
let lastCount = null;
let lastTime = null;
let currentMood = null;
let lastHumanDetectionTime = 0;

// Fetch chew data & update mood
async function fetchDataAndUpdateMood() {
    try {
        const snapshot = await get(ref(db, "MPU6050"));
        if (!snapshot.exists()) return;
        const data = snapshot.val();
        const count = Number(data.Count);
        const time = Number(data.RealTime);
        chewCountEl.textContent = `Total Chews: ${count}`;

        if (lastCount !== null && lastTime !== null) {
            const chewRate = (count - lastCount) / (time - lastTime);
            const chewsPerMin = chewRate * 60;

            // Update chart
            const nowLabel = new Date().toLocaleTimeString();
            chewChart.data.labels.push(nowLabel);
            chewChart.data.datasets[0].data.push(chewsPerMin);
            if (chewChart.data.labels.length > 20) {
                chewChart.data.labels.shift();
                chewChart.data.datasets[0].data.shift();
            }
            chewChart.update();

            // Mood detection
            let newMood;
            if (chewRate >= 0.3) newMood = "happy";
            else if (chewRate >= 0.2) newMood = "neutral";
            else newMood = "sad";

            if (newMood !== currentMood) playMoodOnceThenLoop(newMood);
        }

        lastCount = count;
        lastTime = time;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Play mood video once, then loop
function playMoodOnceThenLoop(mood) {
    currentMood = mood;
    moodStatus.textContent = `Mood: ${mood.toUpperCase()}`;
    moodVideo.src = videos[mood];
    moodVideo.loop = false;
    moodVideo.currentTime = 0;
    moodVideo.play().catch(err => console.warn("Video play error:", err));
    moodVideo.onended = () => {
        moodVideo.loop = true;
        moodVideo.play();
    };
}

// Human detection reaction
function handleHumanDetection() {
    const now = Date.now();
    if (now - lastHumanDetectionTime < 5000) return; // cooldown
    lastHumanDetectionTime = now;

    moodVideo.onended = null;
    moodVideo.src = videos.dialogue;
    moodVideo.loop = false;
    moodVideo.currentTime = 0;
    moodVideo.play();
    moodVideo.onended = () => {
        playMoodOnceThenLoop(currentMood || "neutral");
    };
}

// Listen for ultrasonic motion detection
onValue(ref(db, "Ultrasonic/motion_detected"), (snapshot) => {
    if (snapshot.exists() && snapshot.val() === true) {
        handleHumanDetection();
    }
});

// Run every 10 seconds
setInterval(fetchDataAndUpdateMood, 10000);
