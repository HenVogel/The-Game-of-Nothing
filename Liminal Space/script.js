// Game state
let gameStartTime = null;
let lastActivityTime = null;
let inputCount = 0;
let terminalVisible = false;
let gameStarted = false;
let lastShapeTime = 0;
let nextShapeDelay = 0;
let nextIdleTime = 0;
let lastScreechTime = 0;
let nextScreechDelay = 0;
let lastSmallNoiseTime = 0;
let nextSmallNoiseDelay = 0;
let clickCount = 0;
let largeFlash10hDone = false;
let largeFlash24hDone = false;


// DOM elements
const welcomeButton = document.getElementById('welcome-button');
const nothingText = document.getElementById('nothing-text');
const shape = document.getElementById('disappearing-shape');
const terminal = document.getElementById('terminal');
const terminalContent = document.getElementById('terminal-content');
const terminalInput = document.getElementById('terminal-input');


// Audio elements
const backgroundMusic = new Audio('assets/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3; // Adjust as needed

// All noise sounds combined
const noises = [
    new Audio('assets/noise1.mp3'),
    new Audio('assets/noise2.mp3'),
    new Audio('assets/noise3.mp3'),
    new Audio('assets/noise4.mp3'),
    new Audio('assets/noise5.mp3'),
    new Audio('assets/noise6.mp3'),
    new Audio('assets/noise7.mp3'),
    new Audio('assets/noise8.mp3'),
    new Audio('assets/noise9.mp3'),
    new Audio('assets/noise10.mp3')
];

// Messages


const messages = [
    "Still nothing.",
    "Why are you here?",
    "Even leaving does nothing.",
    "You could have done anything else.",
    "This is all your fault.",
    "You found the secret. It is still nothing.",
    "You win. Nothing changes.",
    "You escaped.",
    "This was your choice.",
    "...",
    "The walls are watching.",
    "You're not alone in the void.",
    "Time doesn't exist here.",
    "The silence is getting louder.",
    "Something moved in the corner of your eye.",
    "The screen is breathing.",
    "You've been here before.",
    "HELP US HELP US HELP US",
    "The darkness is growing.",
    "Your reflection isn't yours.",
    "The hum is getting closer.",
    "Shadows move when you blink.",
    "Footsteps echo behind you.",
    "The light is fading.",
    "You feel someone breathing.",
    "The temperature drops suddenly.",
    "Your phone rings but no one answers.",
    "The floor is tilting beneath you.",
    "The whisper comes from the walls.",
    "The clock ticks backward.",
    "You can't scream.",
    "The corridor stretches on forever.",
    "Your reflection watches you.",
    "There's something under the floorboards.",
    "The mirror shows someone else.",
    "FREE US FREE US FREE US",
    "Door knobs turn by themselves.",
    "The map has no exit.",
    "Your name is carved on the door.",
    "You smell smoke but see no fire.",
    "You've dreamt this before.",
    "You're running but going nowhere."
];


// Initialize game
function init() {
    welcomeButton.addEventListener('click', startGame);
    document.addEventListener('click', handleClicks);
}


function startGame() {
    gameStarted = true;
    gameStartTime = Date.now();
    lastActivityTime = Date.now();
    lastShapeTime = Date.now();
    lastScreechTime = Date.now();
    lastSmallNoiseTime = Date.now();
    welcomeButton.style.display = 'none';
    // Set initial random delays
    nextShapeDelay = Math.random() * 30000; // Random delay between 0-30 seconds
    nextIdleTime = Math.random() * 45 + 15; // Random time between 15-60 seconds
    nextScreechDelay = Math.random() * 1200000 + 300000; // Random time between 5-25 minutes
    nextSmallNoiseDelay = Math.random() * 80000 + 10000; // 10-90 seconds

    // Start background music
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();

    // Start game loop
    setInterval(gameLoop, 1000);
    setInterval(checkIdle, 5000);

    // Terminal input handler
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim();
            inputCount++;
            
            let response = 'undefined';
            
            // Handle different commands
            if (input.toLowerCase() === 'help') {
                response = 'there is no help';
            } else if (input.toLowerCase() === 'i found the key') {
                response = 'HELP US';
                terminal.style.transition = 'background-color 0.5s';
                let isGreen = true;
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                    terminal.style.backgroundColor = isGreen ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                    isGreen = !isGreen;
                    flashCount++;
                    if (flashCount >= 4) { // 4 flashes = 2 seconds
                        clearInterval(flashInterval);
                        terminal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    }
                }, 500);
            } else if (input.toLowerCase().startsWith('echo ')) {
                response = input.slice(5); // Remove 'echo ' from the start
            }

            terminalContent.innerHTML += `> ${input}<br>${response}<br>`;
            terminalInput.value = '';
            terminalContent.scrollTop = terminalContent.scrollHeight;
           
            if (inputCount >= 100) {
                showMessage(messages[9]);
            }
        }
    });

    // Track mouse movement
    document.addEventListener('mousemove', () => {
        lastActivityTime = Date.now();
    });
}


// Main game loop
function gameLoop() {
    if (!gameStarted) return;
   
    const elapsedTime = (Date.now() - gameStartTime) / 1000;
    const currentTime = Date.now();
   
    // Check if it's time to show the shape
    if (currentTime - lastShapeTime >= nextShapeDelay) {
        showShape();
        lastShapeTime = currentTime;
        nextShapeDelay = Math.random() * Math.random() * 300000;
    }
   
    // Check if it's time for a noise
    if (currentTime - lastScreechTime >= nextScreechDelay) {
        playRandomNoise();
        lastScreechTime = currentTime;
        nextScreechDelay = Math.random() * 1200000 + 300000; // Random time between 5-25 minutes
    }
   
    // Check if it's time for a small noise
    if (currentTime - lastSmallNoiseTime >= nextSmallNoiseDelay) {
        playRandomNoise();
        lastSmallNoiseTime = currentTime;
        nextSmallNoiseDelay = Math.random() * 80000 + 10000; // 10-90 seconds
    }
   
    // Every 5 minutes
    if (elapsedTime % 300 < 1) {
        const randomEvent = Math.floor(Math.random() * 2);
        switch (randomEvent) {
            case 0:
                showMessage(messages[0]);
                break;
            case 1:
                showMessage(messages[1]);
                break;
        }
    }


    // After 1 hour
    if (elapsedTime >= 3600 && !terminalVisible) {
        showTerminal();
    }


    // After 10 hours
    if (elapsedTime >= 36000 && !largeFlash10hDone) {
        // Large flashing text then normal message
        flashLargeText(messages[6]);
        showMessage(messages[6]);
        largeFlash10hDone = true;
    }


    // After 24 hours
    if (elapsedTime >= 86400 && !largeFlash24hDone) {
        // Large flashing text then normal message
        flashLargeText(messages[8]);
        showMessage(messages[8]);
        largeFlash24hDone = true;
    }
}


// Play random noise sound
function playRandomNoise() {
    const randomIndex = Math.floor(Math.random() * noises.length);
    const noise = noises[randomIndex];
    noise.volume = 0.4; // Adjust volume as needed
    noise.currentTime = 0;
    noise.play();
}


// Check for idle time
function checkIdle() {
    if (!gameStarted) return;
   
    const idleTime = (Date.now() - lastActivityTime) / 1000;
    if (idleTime > nextIdleTime) {
        const randomMessage = Math.floor(Math.random() * 10) + 10;
        showMessage(messages[randomMessage]);
        nextIdleTime = Math.random() * 45 + 15;
    }
}


// Show a message
function showMessage(message) {
    nothingText.textContent = message;
    nothingText.style.transition = 'opacity 2s ease-in-out';
    nothingText.style.opacity = 1;

    // Special effect for the corner eye message
    if (message === "Something moved in the corner of your eye.") {
        flashCornerShape();
    }

    setTimeout(() => {
        nothingText.style.opacity = 0;
    }, 5000);
}


// Flash shape in corner effect
function flashCornerShape() {
    const cornerShape = document.createElement('img');
    const shapeIndex = Math.floor(Math.random() * 4) + 1; // 1 to 4
    cornerShape.src = `assets/shape${shapeIndex}.png`;
    cornerShape.style.position = 'fixed';
    cornerShape.style.width = '10vw';  // 10% of viewport width
    cornerShape.style.height = '10vh';  // 10% of viewport height

    // Randomly select a corner (0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right)
    const corner = Math.floor(Math.random() * 4);
    switch(corner) {
        case 0: // Top-left
            cornerShape.style.top = '20px';
            cornerShape.style.left = '20px';
            cornerShape.style.transformOrigin = 'top left';
            break;
        case 1: // Top-right
            cornerShape.style.top = '20px';
            cornerShape.style.right = '20px';
            cornerShape.style.transformOrigin = 'top right';
            break;
        case 2: // Bottom-left
            cornerShape.style.bottom = '20px';
            cornerShape.style.left = '20px';
            cornerShape.style.transformOrigin = 'bottom left';
            break;
        case 3: // Bottom-right
            cornerShape.style.bottom = '20px';
            cornerShape.style.right = '20px';
            cornerShape.style.transformOrigin = 'bottom right';
            break;
    }

    cornerShape.style.opacity = '0';
    cornerShape.style.transition = 'opacity 0.1s';
    document.body.appendChild(cornerShape);

    let flashCount = 0;
    const maxFlashes = 3;
    const flashInterval = 200; // milliseconds between flashes

    function flash() {
        if (flashCount >= maxFlashes) {
            cornerShape.remove();
            return;
        }

        // Change to a different random shape each flash
        const newShapeIndex = Math.floor(Math.random() * 4) + 1;
        cornerShape.src = `assets/shape${newShapeIndex}.png`;
        cornerShape.style.opacity = '1';
        setTimeout(() => {
            cornerShape.style.opacity = '0';
            flashCount++;
            setTimeout(flash, flashInterval);
        }, 50);
    }

    flash();
}


// Show the shape
function showShape() {
    // Randomly select one of four shape images
    const shapeIndex = Math.floor(Math.random() * 4) + 1; // 1 to 4
    shape.src = `assets/shape${shapeIndex}.png`;
    shape.style.display = 'block';
    shape.style.width = '100vw';  // Full viewport width
    shape.style.height = '100vh';  // Full viewport height
    shape.style.position = 'fixed';
    shape.style.top = '0';
    shape.style.left = '0';
    shape.style.zIndex = '1000';
    setTimeout(() => {
        shape.style.display = 'none';
    }, 220);
}


// Show terminal
function showTerminal() {
    terminal.style.display = 'block';
    terminalVisible = true;
    terminalContent.innerHTML = '> echo nothing<br>nothing<br>';
}


// Handle click count to reveal key
function handleClicks() {
    clickCount++;
    if (clickCount === 100) {
        showKeyImage();
        document.removeEventListener('click', handleClicks);
    }
}


// Display key image to click
function showKeyImage() {
    const keyImg = document.createElement('img');
    keyImg.id = 'found-key';
    keyImg.src = 'assets/key.png';
    keyImg.style.position = 'fixed';
    // Position key at a random spot on screen
    const xPercent = Math.random() * 90; // between 0 and 90
    const yPercent = Math.random() * 90; // between 0 and 90
    keyImg.style.top = `${yPercent}vh`;
    keyImg.style.left = `${xPercent}vw`;
    keyImg.style.zIndex = '1500';
    keyImg.style.cursor = 'pointer';
    document.body.appendChild(keyImg);
    keyImg.addEventListener('click', () => {
        keyImg.remove();
        showKeyFoundOverlay();
    });
}


// Flash overlay with repeated red text
function showKeyFoundOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'key-found-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '2000';
    overlay.style.overflow = 'hidden';
    const content = document.createElement('div');
    content.style.color = 'red';
    content.style.fontSize = '5vw';
    content.style.fontWeight = 'bold';
    content.style.whiteSpace = 'pre-wrap';
    let text = '';
    for (let i = 0; i < 200; i++) {
        text += 'YOU FOUND THE KEY HELP US ';
    }
    content.textContent = text;
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    // Flash overlay N times then stop
    let visible = true;
    let flashCount = 0;
    const maxFlashes = 8;
    const intervalId = setInterval(() => {
        overlay.style.visibility = visible ? 'visible' : 'hidden';
        visible = !visible;
        flashCount++;
        if (flashCount >= maxFlashes) {
            clearInterval(intervalId);
            overlay.remove();
        }
    }, 500);
}


// Flash large text above normal messages for 10 seconds
function flashLargeText(message) {
    const flashDiv = document.createElement('div');
    flashDiv.textContent = message;
    flashDiv.style.position = 'fixed';
    flashDiv.style.top = '10%';
    flashDiv.style.left = '50%';
    flashDiv.style.transform = 'translateX(-50%)';
    flashDiv.style.color = 'white';
    flashDiv.style.fontSize = '5vw';
    flashDiv.style.fontWeight = 'bold';
    flashDiv.style.zIndex = '3000';
    flashDiv.style.textAlign = 'center';
    document.body.appendChild(flashDiv);
    let visible = true;
    let elapsed = 0;
    const interval = 200; // ms per toggle
    const intervalId = setInterval(() => {
        flashDiv.style.display = visible ? 'block' : 'none';
        visible = !visible;
        elapsed += interval;
        if (elapsed >= 10000) { // after 10 seconds
            clearInterval(intervalId);
            flashDiv.remove();
        }
    }, interval);
}


// Initialize the game
init();
