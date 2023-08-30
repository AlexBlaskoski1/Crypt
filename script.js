
 // Get the canvas element
 const canvas = document.getElementById('gameCanvas');
 const ctx = canvas.getContext('2d');
 const FRAME_INTERVAL = 1000 / 60; // 16.67 ms
 // Player object
 const player = {
   x: canvas.width / 2,
   y: canvas.height / 2,
   radius: 10,
   color: 'blue',
   speed: 300, // Pixels per second
   score: 0,
   weapon: { type: 'Cajado Ametista', color: 'black', damage: 10, cooldown: 0.5, ability: 'none' },
   powerUp: false,
   powerUpDuration: 5, // Power-up duration in seconds
   lives: 3, // Número inicial de vidas

 };

 // Time variables
 let lastTime = 0;
 let deltaTime = 0;

 // Enemies array
 const enemies = [];

 // Weapon pickups array
 const weaponPickups = [];

 // Bullets array
 const bullets = [];

 // Weapons array
 const weapons = [
 { type: 'Cajado AMETISTA APRIMORADO', color: 'black', damage: 10, cooldown: 0.5, ability: 'piercing' },
   { type: 'Cajado Ametista', color: 'brown', damage: 20, cooldown: 1.5, ability: 'spread' },
   { type: 'Cajado Supremo', color: 'gray', damage: 100, cooldown: 0.2, ability: 'rapid' },
   { type: 'Estilingue', color: 'orange', damage: 10, cooldown: 2.0, ability: 'explosive' },
   { type: 'Varinha CARMIN APRIMORADA', color: 'darkblue', damage: 100, cooldown: 2.5, ability: 'piercing' },
   { type: 'Varinha Carmin', color: 'red', damage: 5, cooldown: 0.1, ability: 'burning' },
   { type: 'Varinha de Gelo', color: 'cyan', damage: 20, cooldown: 3.0, ability: 'penetrating' },
 ];

 // Power-ups array
 const powerUps = [
 ];
 const newPlayerSprite = new Image();
 newPlayerSprite.src = 'mage_guardian-magenta.png'; 


 const spritesheet = new Image();
 spritesheet.src = 'mage_guardian-blue.png';
 
 const frameWidth = 64;  // Largura de cada frame
 const frameHeight = 64; // Altura de cada frame
 let currentFrame = 0;    // Índice do frame atual
 const totalFrames = 12;   // Número total de frames no spritesheet
 
 const frameDelay = 500;  // Atraso em milissegundos entre os quadros
 
 // Array para armazenar inimigos
 // Carregar imagens de armas
const weaponImages = {};
weapons.forEach((weapon) => {
  const image = new Image();
  image.src = 'weapons/' + weapon.type.toLowerCase() + '.png';
  weaponImages[weapon.type] = image;
});

 // Função para atualizar a animação
function updateAnimation(x, y) {
  ctx.drawImage(
    newPlayerSprite,  // Usando a nova imagem do jogador
    currentFrame * frameWidth, 0, frameWidth, frameHeight,
    x, y, frameWidth, frameHeight
  );

  currentFrame = (currentFrame + 1) % totalFrames;
}

 // Função para atualizar e desenhar inimigos
 function updateEnemies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const enemy of enemies) {
    updateAnimation(enemy.x, enemy.y);
    enemy.x += enemy.speed / frameDelay;
    enemy.y += enemy.speed / frameDelay;

    // Checar colisões, remover inimigos, etc.

    // Se inimigo saiu da tela, remova-o do array
    if (enemy.x > canvas.width || enemy.y > canvas.height) {
      const index = enemies.indexOf(enemy);
      if (index !== -1) {
        enemies.splice(index, 1);
      }
    }
  }
}
const weaponIcon = document.getElementById('weaponIcon');
const weaponImage = document.getElementById('weaponImage');

// Atualize o ícone da arma
function updateWeaponIcon() {
  weaponImage.src = 'weapons/' + player.weapon.type.toLowerCase() + '.png';
}

// Chame a função para atualizar o ícone da arma
updateWeaponIcon();

// Atualize a posição do ícone da arma fora do canvas
function updateWeaponIconPosition() {
  weaponIcon.style.left = (canvas.width + 20) + 'px';  // Posicione à direita do canvas
  weaponIcon.style.top = (canvas.height / 2) + 'px';   // Posicione verticalmente no meio
}

// Chame a função para atualizar a posição do ícone da arma
updateWeaponIconPosition();
 // Carregar o spritesheet e iniciar a animação
 spritesheet.onload = () => {
   spawnEnemies();
   updateEnemies();
 };
 
 // Spawn de inimigo
 function spawnEnemies() {
   const enemyCount = Math.floor(Math.random() * 3) + 1; // Randomly spawn 1 to 3 enemies
   for (let i = 0; i < enemyCount; i++) {
     const enemy = {
       x: Math.random() * canvas.width,
       y: Math.random() * canvas.height,
       color: 'red',
       radius: 20,
       speed: Math.random() * 10 + 20, // Pixels per second
       health: 100, // Add health property to enemies
     };
     enemies.push(enemy);
   }
 }

// Spawn weapon pickups
function spawnWeaponPickups() {
  const weapon = weapons[Math.floor(Math.random() * weapons.length)];
  const weaponPickup = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 6,
    color: weapon.color,
    weapon: weapon,
  };
  weaponPickups.push(weaponPickup);

  const weaponImage = new Image();
  weaponImage.src = 'weapons/' + weapon.type.toLowerCase() + '.png';
  weaponImage.onload = () => {
    ctx.drawImage(
      weaponImage,
      weaponPickup.x - weaponPickup.radius,
      weaponPickup.y - weaponPickup.radius,
      weaponPickup.radius * 2,
      weaponPickup.radius * 2
    );
  };
}

// Spawn power-ups

// Fire bullet
function fireBullet() {
if (player.weapon.cooldown > 0) {
 return; // Ignore if the weapon is still on cooldown
}    function fireBullet() {
   if (player.weapon.cooldown <= 0) {
     const bullet = {
       x: player.x,
       y: player.y,
       radius: 5,
       color: 'yellow',
       speed: 500,
       directionX: 0,
       directionY: 0,
       damage: player.weapon.damage,
     };

     const dx = player.x - canvas.width / 2;
     const dy = player.y - canvas.height / 2;
     const distance = Math.sqrt(dx * dx + dy * dy);
     bullet.directionX = dx / distance;
     bullet.directionY = dy / distance;

     bullets.push(bullet);
     player.weapon.cooldown = player.weapon.ability === 'rapid' ? 0.2 : player.weapon.cooldown;

     if (player.weapon.ability === 'spread') {
       const spreadAngle = 20;
       const numBullets = 5;

       for (let i = 0; i < numBullets; i++) {
         const spreadBullet = { ...bullet };
         const angle = (i - (numBullets - 1) / 2) * spreadAngle * (Math.PI / 180);
         spreadBullet.directionX = Math.cos(angle);
         spreadBullet.directionY = Math.sin(angle);
         bullets.push(spreadBullet);
       }
     }

     if (player.weapon.ability === 'explosive') {
       const explosionRadius = 50;

       setTimeout(() => {
         for (let i = 0; i < enemies.length; i++) {
           const enemy = enemies[i];
           const dx = bullet.x - enemy.x;
           const dy = bullet.y - enemy.y;
           const distance = Math.sqrt(dx * dx + dy * dy);

           if (distance < explosionRadius + enemy.radius) {
             enemy.health -= bullet.damage;

             if (enemy.health <= 0) {
               player.score += 100;
               enemies.splice(i, 1);
               i--;
             }
           }
         }
       }, 500);
     }

     player.powerUp = player.weapon.ability === 'burning';
     player.powerUpDuration = player.powerUp ? 5 : 0;
   }
 }

const bullet = {
 x: player.x,
 y: player.y,
 radius: 3,
 color: 'black',
 speed: 500, // Pixels per second
 velocity: {
   x: 0,
   y: 0,
 },
 damage: player.weapon.damage,
};

const angle = Math.atan2(
 mouse.y - player.y,
 mouse.x - player.x
);

bullet.velocity.x = Math.cos(angle) * bullet.speed;
bullet.velocity.y = Math.sin(angle) * bullet.speed;

bullets.push(bullet);

// Reset weapon cooldown
player.weapon.cooldown = player.weapon.cooldown;

// Apply rapid fire ability
if (player.weapon.ability === 'rapid') {
 player.weapon.cooldown *= 0.5;
}
}

 // Apply power-up ability
 function applyPowerUpAbility() {
   switch (player.powerUp.ability) {
     case 'healing':
       player.health += 25; // Heal the player by 25 health
       break;
     case 'speed':
       player.speed *= 1.5; // Increase the player's speed by 50%
       setTimeout(() => {
         player.speed /= 1.5; // Reset the player's speed back to normal after power-up duration
       }, player.powerUpDuration * 1000);
       break;
     case 'invincible':
       player.invincible = true; // Make the player invincible
       setTimeout(() => {
         player.invincible = false; // Make the player vulnerable again after power-up duration
       }, player.powerUpDuration * 1000);
       break;
   }
 }

 // Game loop
 function gameLoop(timestamp) {
   // Se o jogador ficar sem vidas, chame a função gameOver
   if (player.lives <= 0) {
    gameOver();
    return; // Pare de atualizar o loop se o jogo terminar
  }
   // Calculate delta time
   deltaTime = (timestamp - lastTime) / 1000;
   lastTime = timestamp;

   // Clear the canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   // Move player
   if (keys.KeyW && player.y > 0) player.y -= player.speed * deltaTime;
   if (keys.KeyS && player.y < canvas.height) player.y += player.speed * deltaTime;
   if (keys.KeyA && player.x > 0) player.x -= player.speed * deltaTime;
   if (keys.KeyD && player.x < canvas.width) player.x += player.speed * deltaTime;

   // Draw player
   ctx.beginPath();
   updateAnimation(player.x - frameWidth / 2, player.y - frameHeight / 2);
   ctx.fillStyle = player.color;
   ctx.fill();
   ctx.closePath();

   // Move and draw enemies
   enemies.forEach((enemy, index) => {
     // Calculate the direction vector towards the player
     const dx = player.x - enemy.x;
     const dy = player.y - enemy.y;
     const distance = Math.sqrt(dx * dx + dy * dy);
     const directionX = dx / distance;
     const directionY = dy / distance;

     // Move the enemy towards the player
     enemy.x += directionX * enemy.speed * deltaTime;
     enemy.y += directionY * enemy.speed * deltaTime;
     updateWeaponIcon();
     updateWeaponIconPosition();
     // Detect collision with player
     if (distance < player.radius + enemy.radius) {
       if (!player.invincible) {
        player.lives--; // Reduza o número de vidas
        if (player.lives <= 0) {
          gameOver();
        } else {
          enemies.splice(index, 1);
          const somElement = document.getElementById('hit');
          somElement.volume = 0.5;
          somElement.play();
        }
      }
    }
     // Remove enemies that are off-screen or defeated
     if (
       enemy.x < -enemy.radius ||
       enemy.x > canvas.width + enemy.radius ||
       enemy.y < -enemy.radius ||
       enemy.y > canvas.height + enemy.radius ||
       enemy.health <= 0
     ) {
       enemies.splice(index, 1);
     }

     updateAnimation(enemy.x - frameWidth / 2, enemy.y - frameHeight / 2);
    });
    
    // Draw player animation
    updateAnimation(player.x - frameWidth / 2, player.y - frameHeight / 2);

 // Dentro do loop de jogo (gameLoop)
// Move and draw weapon pickups
weaponPickups.forEach((pickup, index) => {
  const dx = player.x - pickup.x;
  const dy = player.y - pickup.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.radius + pickup.radius) {
    if (pickup.weapon) {
      player.weapon = pickup.weapon;
    } else if (pickup.powerUp) {
      player.powerUp = pickup.powerUp;
      applyPowerUpAbility();
    }
    weaponPickups.splice(index, 1);
  }

  if (pickup.weapon) {
    const weaponImage = weaponImages[pickup.weapon.type];
    ctx.drawImage(weaponImage, pickup.x - pickup.radius, pickup.y - pickup.radius, pickup.radius * 2, pickup.radius * 2);
  }
});
  

   // Move and draw bullets
   bullets.forEach((bullet, index) => {
    
     bullet.x += bullet.velocity.x * deltaTime;
     bullet.y += bullet.velocity.y * deltaTime;

     // Remove bullets that are off-screen
     if (
       bullet.x < -bullet.radius ||
       bullet.x > canvas.width + bullet.radius ||
       bullet.y < -bullet.radius ||
       bullet.y > canvas.height + bullet.radius
     ) {
       bullets.splice(index, 1);
     }

     // Detect collision with enemies
     enemies.forEach((enemy, enemyIndex) => {
       const dx = bullet.x - enemy.x;
       const dy = bullet.y - enemy.y;
       const distance = Math.sqrt(dx * dx + dy * dy);

       if (distance < enemy.radius) {
         // Bullet hit the enemy
         enemy.health -= bullet.damage;
         if (enemy.health <= 0) {
           // Enemy defeated, increase score
           player.score += enemy.radius;
           enemies.splice(enemyIndex, 1);
         }

         bullets.splice(index, 1); // Remove bullet
       }
     });

     // Draw bullet
     ctx.beginPath();
     ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
     ctx.fillStyle = bullet.color;
     ctx.fill();
     ctx.closePath();
   });

   // Draw player score
   ctx.font = '24px Arial';
   ctx.fillStyle = 'black';
   ctx.fillText('Score: ' + player.score, 10, 30);
   ctx.font = '24px Arial';
ctx.fillStyle = 'black';
ctx.fillText('Lives: ' + player.lives, 10, 90);

   // Draw player weapon
   ctx.font = '24px Arial';
   ctx.fillStyle = 'black';
   ctx.fillText('Weapon: ' + player.weapon.type, 10, 60);

   // Draw player power-up status
   if (player.powerUp) {
     ctx.font = '24px Arial';
     ctx.fillStyle = 'black';
     ctx.fillText(
       'Power-Up: Active',
       canvas.width - 200,
       30
     );
   }

   // Update weapon cooldown
   if (player.weapon.cooldown > 0) {
     player.weapon.cooldown -= deltaTime;
   }

   // Spawn enemies and weapon pickups randomly
   if (Math.random() < 0.01) {
     spawnEnemies();
   }
   if (Math.random() < 0.005) {
     spawnWeaponPickups();
   }
   if (Math.random() < 0.002) {
    spawnWeaponPickups();
   }

   // Call the game loop recursively
   requestAnimationFrame(gameLoop);
 }

 // Game over
 function gameOver() {
  // Stop the game loop
  cancelAnimationFrame(gameLoop);

  // Aplica o efeito de blur na tela
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  tempCtx.filter = 'blur(10px)'; // Ajuste o valor de blur conforme necessário
  tempCtx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

  // Exibe a mensagem de game over em cima do blur
  ctx.drawImage(tempCanvas, 0, 0); // Renderiza o blur
  ctx.font = '48px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2); // Exibe o texto
}

// Chame a função gameOver para testar
gameOver();

 // Mouse event listeners
 const mouse = { x: 0, y: 0 };

 canvas.addEventListener('mousemove', (event) => {
   const rect = canvas.getBoundingClientRect();
   mouse.x = event.clientX - rect.left;
   mouse.y = event.clientY - rect.top;
 });

 canvas.addEventListener('mousedown', () => {
   fireBullet();
   const somElement = document.getElementById('hit');
   somElement.volume = 0.5;
   somElement.play();
   const somElement2 = document.getElementById('musica');
   somElement2.volume = 0.5;
   somElement2.play();
 });

 // Keyboard event listeners
 const keys = {};

 document.addEventListener('keydown', (event) => {
   keys[event.code] = true;
 });

 document.addEventListener('keyup', (event) => {
   keys[event.code] = false;
 });

 // Start the game loop
 requestAnimationFrame(gameLoop);

 