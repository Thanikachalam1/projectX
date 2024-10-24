const fire = document.getElementById('fire');
const guidanceText = document.getElementById('guidance-text');
let isMovingUp = false;
let altitude = 0;
const clouds = [];
const stars = [];
const maxClouds = 10;
const maxStars = 100;
const cloudSpeed = 5;
const starSpeed = 0.01;
let cloudIntervalSet = false;
let cloudVisibilityTimeout;
let automaticMovement = false;
const throttleSound = document.getElementById('throttle-sound');
const spaceSound = document.getElementById('space-sound');
const fuelValue = document.getElementById('fuel-value');
const massValue = document.getElementById('mass-value');
const moon = document.getElementById('moon');
let fuel = 700;
let mass = 254000;
let engineActivated = false;
let fuelDepleted = false;


function handleFuelDepletion() {
    fuelDepleted = true;
    engineActivated = false;
    fire.style.display = 'none';
    fire.style.opacity = 0;
    guidanceText.style.display = 'block';
    guidanceText.style.color = "white";
}

function updateFuel() {
    if ((engineActivated && fuel > 0) || altitude < 200) {
        fuel = Math.max(fuel - 10, 0);
        fuelValue.textContent = fuel;
        if (fuel > 0) {
            mass = Math.max(mass - 1, 0);
            massValue.textContent = mass;
        }
        if (fuel === 0) {
            handleFuelDepletion();
        }
    }
}

function resetValues() {
    fuel = 700;
    mass = 254000;
    fuelValue.textContent = fuel;
    massValue.textContent = mass;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && altitude < 2000) {
        engineActivated = true;
        fire.style.display = 'none';
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        engineActivated = false;
        fire.style.display = 'none';
    }
});

setInterval(updateFuel, 100);

function createCloud() {
    if (clouds.length < maxClouds) {
        const cloud = document.createElement('img');
        cloud.src = 'cloud.png';
        cloud.className = 'cloud';
        cloud.style.width = `${Math.random() * 200 + 200}px`;
        cloud.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
        cloud.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
        document.body.appendChild(cloud);
        clouds.push(cloud);
    }
}

function createStar() {
    if (stars.length < maxStars) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${Math.random() * window.innerHeight}px`;
        document.body.appendChild(star);
        stars.push(star);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && altitude < 2000) {
        isMovingUp = true;
        fire.style.display = 'none';
        fire.style.opacity = 1;
        guidanceText.style.display = 'none';
        throttleSound.play();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        isMovingUp = false;
        fire.style.opacity = 0;
        setTimeout(() => fire.style.display = 'none', 50);
        throttleSound.pause();
        throttleSound.currentTime = 0;
    }
});

let reachedSpace = false;  




function animate() {
  requestAnimationFrame(animate);
   console.log(altitude) 
  
  clouds.forEach(cloud => {
    let currentTop = parseFloat(cloud.style.top);
    if (isMovingUp || automaticMovement) {
      currentTop += cloudSpeed;
    } else {
      currentTop -= cloudSpeed;
    }
    if (currentTop > window.innerHeight) {
      currentTop = -100;
    } else if (currentTop < -100) {
      currentTop = window.innerHeight;
    }
    cloud.style.top = `${currentTop}px`;
  });


  stars.forEach(star => {
    let currentTop = parseFloat(star.style.top);
    if (isMovingUp || automaticMovement) {
      currentTop += starSpeed;
    } else {
      currentTop -= starSpeed;
    }
    if (currentTop > window.innerHeight) {
      currentTop = -5;
    } else if (currentTop < -5) {
      currentTop = window.innerHeight;
    }
    star.style.top = `${currentTop}px`;
  });

  if (isMovingUp || automaticMovement) {
    altitude += cloudSpeed;
    fire.style.display = 'block';
    fire.style.opacity = 1;
  } else {
    altitude -= cloudSpeed;
    fire.style.display = 'none';
  }


  if (altitude < 900) {
    if (!cloudIntervalSet) {
      for (let i = 0; i < maxClouds; i++) {
        createCloud();
      }
      setInterval(() => createCloud(), 1000);
      cloudIntervalSet = true;
    }
    document.body.style.backgroundColor = "skyblue";
    clouds.forEach(cloud => {
      cloud.style.opacity = 0.7;
    });
    stars.forEach(star => {
      star.style.opacity = 0;
    });
    reachedSpace = false;
  }


  else if (altitude >= 900 && altitude < 2000) {
    const fadeOutOpacity = (1100 - altitude) / 500;
    clouds.forEach(cloud => {
      cloud.style.opacity = Math.max(fadeOutOpacity, 0);
    });
    document.body.style.backgroundColor = "skyblue";
    stars.forEach(star => {
      star.style.opacity = (altitude - 900) / 100;
    });
    if (cloudVisibilityTimeout) {
      clearTimeout(cloudVisibilityTimeout);
    }
    cloudVisibilityTimeout = setTimeout(() => {
      clouds.forEach(cloud => {
        cloud.style.opacity = 0;
      });
    }, 5000);
  }

 
  else if (altitude >= 2000) {
    fire.style.display = 'none';
    moon.style.display = "block";
    document.body.style.backgroundColor = "#001f3f";
    clouds.forEach(cloud => {
      cloud.style.opacity = 0;
    });
    stars.forEach(star => {
      star.style.opacity = 1;
    });
    
    if (!reachedSpace) {
      spaceSound.play();
      reachedSpace = true;
    }
    automaticMovement = true;
    if (engineActivated) {
      if (altitude < 2000 && fuel > 0) {
        fuel = Math.max(fuel - 10, 0);
        fuelValue.textContent = fuel;
        if(fuel > 0) {
          mass = Math.max(mass - 1, 0);
          massValue.textContent = mass;
        }
      }
    }
    setTimeout(() => {
      guidanceText.style.display = 'block';
      guidanceText.textContent = 'You reached space!';
      guidanceText.style.color = "white";
    }, 1000);
  }


  if (altitude <= 0) {
    guidanceText.style.display = 'block';
    guidanceText.textContent = 'Press Up Arrow to Launch!';
    clouds.forEach(cloud => {
      cloud.style.opacity = 0;
    });
    stars.forEach(star => {
      star.style.opacity = 0;
    });
    document.body.style.backgroundColor = "skyblue";
    altitude = 0;
    isMovingUp = false;
    automaticMovement = false;
    fire.style.display = 'none';
  }
  if (altitude >= 2000){
    moon.style.display = "block";
  }
}


function manageSounds() {
    if (altitude >= 2000) {
        throttleSound.pause();
        throttleSound.currentTime = 0;
        spaceSound.play();
        fire.style.display = "none";
    } else {
        if (isMovingUp && throttleSound.paused) {
            throttleSound.play();
        }
    }
}

for (let i = 0; i < maxStars; i++) {
    createStar();

}

animate();

    guidanceText.style.color = "white";


function updateFuel() {
        
    if (engineActivated) {
            
        if (altitude < 2000 && fuel > 0) {
            fuel = Math.max(fuel - 10, 0);
            fuelValue.textContent = fuel;
    
                
            if(fuel > 0) {
                mass = Math.max(mass - 1, 0);
                massValue.textContent = mass;
            }
            
        }
    }
}
    

function resetValues() {
    fuel = 10000;
    mass = 254000;
    fuelValue.textContent = fuel;
    massValue.textContent = mass;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        engineActivated = true;
        fire.style.display = 'block';
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        engineActivated = false;
        fire.style.display = 'none';
    }
});

setInterval(updateFuel, 100);

function createCloud() {
    if (clouds.length < maxClouds) {
        const cloud = document.createElement('img');
        cloud.src = 'cloud.png';
        cloud.className = 'cloud';
        cloud.style.width = `${Math.random() * 200 + 200}px`;
        cloud.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
        cloud.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
        document.body.appendChild(cloud);
        clouds.push(cloud);
    }
}

function createStar() {
    if (stars.length < maxStars) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${Math.random() * window.innerHeight}px`;
        document.body.appendChild(star);
        stars.push(star);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        isMovingUp = true;
        fire.style.display = 'block';
        fire.style.opacity = 1;
        guidanceText.style.display = 'none';
        throttleSound.play();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        isMovingUp = false;
        fire.style.opacity = 0;
        setTimeout(() => fire.style.display = 'none', 50);
        throttleSound.pause();
        throttleSound.currentTime = 0;
    }
});






function animate() {
  requestAnimationFrame(animate);

  
  clouds.forEach(cloud => {
    let currentTop = parseFloat(cloud.style.top);
    if (isMovingUp || automaticMovement) {
      currentTop += cloudSpeed;
    } else {
      currentTop -= cloudSpeed;
    }
    if (currentTop > window.innerHeight) {
      currentTop = -100;
    } else if (currentTop < -100) {
      currentTop = window.innerHeight;
    }
    cloud.style.top = `${currentTop}px`;
  });

  
  stars.forEach(star => {
    let currentTop = parseFloat(star.style.top);
    if (isMovingUp || automaticMovement) {
      currentTop += starSpeed;
    } else {
      currentTop -= starSpeed;
    }
    if (currentTop > window.innerHeight) {
      currentTop = -5;
    } else if (currentTop < -5) {
      currentTop = window.innerHeight;
    }
    star.style.top = `${currentTop}px`;
  });


  if (isMovingUp || automaticMovement) {
    altitude += cloudSpeed;
    fire.style.display = 'block';
    fire.style.opacity = 1;
  } else {
    altitude -= cloudSpeed;
    fire.style.display = 'none';
  }

 
  if (altitude < 900) {
    if (!cloudIntervalSet) {
      for (let i = 0; i < maxClouds; i++) {
        createCloud();
      }
      setInterval(() => createCloud(), 1000);
      cloudIntervalSet = true;
    }
    document.body.style.backgroundColor = "skyblue";
    clouds.forEach(cloud => {
      cloud.style.opacity = 0.7;
    });
    stars.forEach(star => {
      star.style.opacity = 0;
    });
    reachedSpace = false;
  }

 
  else if (altitude >= 900 && altitude < 2000) {
    const fadeOutOpacity = (1100 - altitude) / 500;
    clouds.forEach(cloud => {
      cloud.style.opacity = Math.max(fadeOutOpacity, 0);
    });
    document.body.style.backgroundColor = "skyblue";
    stars.forEach(star => {
      star.style.opacity = (altitude - 900) / 100;
    });
    if (cloudVisibilityTimeout) {
      clearTimeout(cloudVisibilityTimeout);
    }
    cloudVisibilityTimeout = setTimeout(() => {
      clouds.forEach(cloud => {
        cloud.style.opacity = 0;
      });
    }, 5000);
  }

  
  else if (altitude >= 2000) {
    fire.style.display = 'none';
    document.body.style.backgroundColor = "#001f3f";
    clouds.forEach(cloud => {
      cloud.style.opacity = 0;
    });
    stars.forEach(star => {
      star.style.opacity = 1;
    });
    
    
    automaticMovement = true;
    mass = Math.max(mass - 1, 0); 
    massValue.textContent = mass;
    setTimeout(() => {
      guidanceText.style.display = 'block';
      guidanceText.textContent = 'You reached space!';
      guidanceText.style.color = "white";
    }, 5000);
  }


  if (altitude <= 0) {
    guidanceText.style.display = 'block';
    guidanceText.textContent = 'Press Up Arrow to Launch!';
    clouds.forEach(cloud => {
      cloud.style.opacity = 0;
    });
    stars.forEach(star => {
      star.style.opacity = 0;
    });
    document.body.style.backgroundColor = "skyblue";
    altitude = 0;
    isMovingUp = false;
    automaticMovement = false;
    fire.style.display = 'none';
  }
  if (altitude >= 2000){
    moon.style.display = 'block';
    setTimeout(() => {
        moon.style.opacity = 1; 
    }, 2); 
  }
}





for (let i = 0; i < maxStars; i++) {
    createStar();
}

animate();
function a() {
    updateFuel();      
}

a(); 
