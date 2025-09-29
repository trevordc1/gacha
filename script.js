import { Application, Assets, Container, Sprite, Graphics } from 'https://cdn.skypack.dev/pixi.js';

console.log("howdy howdy tamagotchis");
document.getElementById("app").innerHTML = '<h1>Welcome to gotchiCreate</h1>';

(async () => {
  // Create a new application
  const app = new Application();
  
  // Initialize the application
  await app.init({ 
    width: 800,
    height: 600,
    background: '#1099bb' 
  });
  
  // Append the application canvas to the document
  document.getElementById('app').appendChild(app.canvas);
  
  // Create a simple sprite (for testing)
  const graphics = new Graphics();
  graphics.beginFill(0xFF3300);
  graphics.drawRect(50, 50, 100, 100);
  graphics.endFill();
  app.stage.addChild(graphics);
  
  // Create and add a container to the stage
  const container = new Container();
  app.stage.addChild(container);
  
  // Load the bunny texture
  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
  
  // Create a 5x5 grid of bunnies in the container
  for (let i = 0; i < 25; i++) {
    const bunny = new Sprite(texture);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
  }
  
  // Move the container to the center
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  
  // Center the bunny sprites in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;
  
  // Listen for animate update
  app.ticker.add((time) => {
    container.rotation -= 0.01 * time.deltaTime;
  });
})();
