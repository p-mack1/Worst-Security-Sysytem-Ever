const scanBtn = document.querySelector("#scanBtn");
const codeBtn = document.querySelector("#codeBtn");
const redBtn = document.querySelector("#redBtn");
const resetBtn = document.querySelector("#resetBtn");
const retinaBtn = document.querySelector("#retinaBtn");   // NEW button
const voiceBtn = document.querySelector("#voiceBtn");     // NEW button

const codeInput = document.querySelector("#codeInput");
const message = document.querySelector("#message");
const statusText = document.querySelector("#statusText");
const levelText = document.querySelector("#levelText");
const lockIcon = document.querySelector("#lockIcon");
const logText = document.querySelector("#logText");
const consoleBox = document.querySelector(".console");
const screenBox = document.querySelector(".screen");
const suspicionText = document.querySelector("#suspicionText");
const suspicionFill = document.querySelector("#suspicionFill");

let securityLevel = 1;
let idScanned = false;
let failedAttempts = 0;
let redButtonPresses = 0;
let systemLocked = false;
let eyeContactAttempts = 0;   // NEW state variable (used by the retina scanner)
let voiceAttempts = 0;        // NEW state variable (used by voice check)
let suspicion = 0;            // NEW state variable (used by the suspicion meter)

// Suspicion meter: goes up or down, stays between 0 and 100
function changeSuspicion(amount) {
    suspicion = Math.max(0, Math.min(100, suspicion + amount));

    suspicionText.textContent = suspicion;
    suspicionFill.style.width = suspicion + "%";
    suspicionFill.classList.toggle("hot", suspicion >= 70);

    if (suspicion >= 100 && !systemLocked) {
        lockDown();
        logText.textContent = "Suspicion maxed out. The system trusts nobody now.";
    }
}

function scanID() {
    if (systemLocked) {
        return;
    }

    idScanned = true;
    securityLevel = 2;

    message.textContent = "Scanning... you look vaguely like a person.";
    statusText.textContent = "ID ACCEPTED";
    levelText.textContent = securityLevel;
    logText.textContent = "Badge photo does not match face. Approved anyway.";
}

scanBtn.addEventListener("click", scanID);

function checkCode() {
    if (systemLocked) {
        return;
    }

    if (!idScanned) {
        message.textContent = "SCAN YOUR ID FIRST!";
        logText.textContent = "Unauthorized keyboard touching detected.";
        changeSuspicion(10);
        return;
    }

    const enteredCode = codeInput.value;

    if (enteredCode === "435") {
        securityLevel = 3;
        levelText.textContent = securityLevel;
        statusText.textContent = "ACCESS GRANTED";
        message.textContent = "Door unlocked. The door is as surprised as you are.";
        lockIcon.textContent = "UNLOCKED";
        logText.textContent = "Security system deeply regrets this decision.";
        changeSuspicion(-100);
    } else {
        failedAttempts++;

        if (failedAttempts >= 3) {
            message.textContent = "SECURITY ALERT: USER APPEARS CONFUSED.";
            logText.textContent = "Bad codes so far: " + failedAttempts + ". Confidence level: low";
        } else {
            message.textContent = "Nope. Try guessing better.";
            logText.textContent = "Wrong code attempt: " + failedAttempts;
        }
        changeSuspicion(15);
    }
}

codeBtn.addEventListener("click", checkCode);

function pressRedButton() {
    if (systemLocked) {
        return;
    }

    redButtonPresses++;

    if (redButtonPresses === 1) {
        message.textContent = "Why did you press that?";
    } else if (redButtonPresses === 2) {
        message.textContent = "Seriously?";
    } else if (redButtonPresses === 3) {
        message.textContent = "STOP PRESSING THE BUTTON";
        consoleBox.classList.add("warning");
    } else if (redButtonPresses === 4) {
        message.textContent = "This is your final warning.";
        consoleBox.classList.add("shake");
    } else {
        lockDown();
    }

    logText.textContent = "Red button presses: " + redButtonPresses;
    changeSuspicion(10);
}

redBtn.addEventListener("click", pressRedButton);

// NEW action: retina scanner that is afraid of eye contact
function retinaScan() {
    if (systemLocked) {
        return;
    }

    eyeContactAttempts++;

    // NEW if/else condition
    if (eyeContactAttempts < 3) {
        message.textContent = "Retina scanner made eye contact, screamed, and looked away.";
        logText.textContent = "Eye contact attempts: " + eyeContactAttempts + ". Scanner is shaking.";

        // NEW class added by JS (remove first so the animation can replay)
        screenBox.classList.remove("flinch");
        void screenBox.offsetWidth;
        screenBox.classList.add("flinch");
        setTimeout(function () {
            screenBox.classList.remove("flinch");
        }, 500);

        changeSuspicion(10);
    } else {
        message.textContent = "Scanner is staring at the floor. It approves you to avoid eye contact.";
        logText.textContent = "Eye contact attempts: " + eyeContactAttempts + ". Scanner needs a nap.";
        changeSuspicion(-15);
    }
}

retinaBtn.addEventListener("click", retinaScan);

// NEW action: faulty voice verification
function voiceCheck() {
    if (systemLocked) {
        return;
    }

    voiceAttempts++;

    const wrongVoices = [
        "a toaster",
        "your cousin Kevin",
        "a very confident goose",
        "the vending machine",
        "nobody"
    ];
    const guess = wrongVoices[Math.floor(Math.random() * wrongVoices.length)];

    message.textContent = "Voice verified as: " + guess + ".";
    logText.textContent = "Voice attempts: " + voiceAttempts + ". Microphone appears to be a potato.";
    changeSuspicion(8);
}

voiceBtn.addEventListener("click", voiceCheck);

function lockDown() {
    systemLocked = true;

    message.textContent = "FACILITY LOCKDOWN! Please enjoy the darkness.";
    statusText.textContent = "TOTAL FAILURE";
    lockIcon.textContent = "LOCKDOWN";
    logText.textContent = "Facility successfully protected from the user.";

    consoleBox.classList.add("lockdown");
}

function resetSystem() {
    securityLevel = 1;
    idScanned = false;
    failedAttempts = 0;
    redButtonPresses = 0;
    systemLocked = false;
    eyeContactAttempts = 0;
    voiceAttempts = 0;
    suspicion = 0;

    levelText.textContent = securityLevel;
    message.textContent = "Scan your ID to begin.";
    statusText.textContent = "ACCESS DENIED";
    lockIcon.textContent = "LOCKED";
    logText.textContent = "Waiting for suspicious activity...";
    codeInput.value = "";

    suspicionText.textContent = suspicion;
    suspicionFill.style.width = "0%";
    suspicionFill.classList.remove("hot");

    consoleBox.classList.remove("warning", "shake", "lockdown");
    screenBox.classList.remove("flinch");
}

resetBtn.addEventListener("click", resetSystem);