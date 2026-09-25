const scanBtn = document.querySelector("#scanBtn");
const codeBtn = document.querySelector("#codeBtn");
const redBtn = document.querySelector("#redBtn");
const resetBtn = document.querySelector("#resetBtn");

const codeInput = document.querySelector("#codeInput");
const message = document.querySelector("#message");
const statusText = document.querySelector("#statusText");
const levelText = document.querySelector("#levelText");
const lockIcon = document.querySelector("#lockIcon");
const logText = document.querySelector("#logText");
const consoleBox = document.querySelector(".console");

let securityLevel = 1;
let idScanned = false;
let failedAttempts = 0;
let redButtonPresses = 0;
let systemLocked = false;

function scanID() {
    if (systemLocked) {
        return;
    }

    idScanned = true;
    securityLevel = 2;

    message.textContent = "Human detected. Probably.";
    statusText.textContent = "ID ACCEPTED";
    levelText.textContent = securityLevel;
    logText.textContent = "Biological life-form approved.";
}

scanBtn.addEventListener("click", scanID);

function checkCode() {
    if (systemLocked) {
        return;
    }

    if (!idScanned) {
        message.textContent = "SCAN YOUR ID FIRST!";
        logText.textContent = "Unauthorized keyboard touching detected.";
        return;
    }

    const enteredCode = codeInput.value;

    if (enteredCode === "324") {
        securityLevel = 3;
        levelText.textContent = securityLevel;
        statusText.textContent = "ACCESS GRANTED";
        message.textContent = "Door unlocked. Somehow.";
        lockIcon.textContent = "UNLOCKED";
        logText.textContent = "Security system deeply rgrets this decision.";
    } else {
        failedAttempts++;
        if (failedAttempts >= 3) {
            message.textContent = "SECURITY ALERT: USER APPEARS CONFUSED.";
            logText.textContent = "Three or more bad codes. Confidence level: low";
        }
        message.textContent = "ACCESS DENIED.";
        logText.textContent = "Wrong code attempt: " + failedAttempts;
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
        message.textContent = "STOP PRESSING THE BUTTON"
        consoleBox.classList.add("warning");
    } else if (redButtonPresses === 4) {
        message.textContent = "This is your final warning.";
        consoleBox.classList.add("shake");
    } else {
        lockDown();
    }

    logText.textContent = "Red button presses: " + redButtonPresses;
}

redBtn.addEventListener("click", pressRedButton);

function lockDown() {
    systemLocked = true;

    message.textContent = "FACILITY LOCKDOWN!";
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

    levelText.textContent = securityLevel;
    message.textContent = "Scan your ID to begin.";
    statusText.textContent = "ACCESS DENIED";
    lockIcon.textContent = "LOCKED";
    logIcon.textContent = "Waiting for suspicious activity...";
    codeInput.value = "";

    consoleBox.classList.remove("warning", "shake", "lockdown");
}

resetBtn.addEventListener("click", resetSystem);