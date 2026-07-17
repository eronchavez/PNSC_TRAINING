const canvas = document.getElementById("sunCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let sun = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    rotation: 0,
    rotationSpeed: (2 * Math.PI) / 3000,
    speed: 4,
    dx: 1, 
    dy: 1, 
    rotDir: 1 
};

function drawSun(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
   
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();

  
    const numRays = 8;
    for (let i = 0; i < numRays; i++) {
        const angle = state.rotation + i * (2 * Math.PI / numRays);
        ctx.beginPath();
        ctx.moveTo(state.x, state.y);
        const rayLength = 50;
        const endX = state.x + rayLength * Math.cos(angle);
        const endY = state.y + rayLength * Math.sin(angle);
        ctx.stroke();
    }
}

function updateSunPosition() {
    let newX = sun.x + sun.dx * sun.speed;
    let newY = sun.y + sun.dy * sun.speed;

  
    if (newX + sun.radius > canvas.width || newX - sun.radius < 0) {
        sun.dx *= -1;
        newX = sun.x + sun.dx * sun.speed; 
    }

    if (newY + sun.radius > canvas.height || newY - sun.radius < 0) {
        sun.dy *= -1;
        newY = sun.y + sun.dy * sun.speed; 
    }

    sun.x = newX;
    sun.y = newY;

   
    if (newX + sun.radius > canvas.width || newX - sun.radius < 0 ||
        newY + sun.radius > canvas.height || newY - sun.radius < 0) {
        sun.rotDir *= -1;
    }

   
    sun.rotation += sun.rotationSpeed * sun.rotDir;
}

function animate() {
    updateSunPosition();
    drawSun(sun);
    requestAnimationFrame(animate);
}

animate();