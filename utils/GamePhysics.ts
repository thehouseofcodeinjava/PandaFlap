export class GamePhysics {
  static readonly GRAVITY = 0.8;
  static readonly FLAP_STRENGTH = -15;
  static readonly PANDA_SIZE = 40;
  static readonly OBSTACLE_WIDTH = 60;
  static readonly INITIAL_SPEED = 2;
  static readonly MAX_SPEED = 6;
  static readonly SPEED_INCREMENT = 0.5;

  static checkCollision(
    pandaX: number,
    pandaY: number,
    obstacleX: number,
    gapY: number,
    gapHeight: number,
    screenHeight: number
  ): boolean {
    const pandaLeft = pandaX - this.PANDA_SIZE / 2;
    const pandaRight = pandaX + this.PANDA_SIZE / 2;
    const pandaTop = pandaY - this.PANDA_SIZE / 2;
    const pandaBottom = pandaY + this.PANDA_SIZE / 2;

    const obstacleLeft = obstacleX;
    const obstacleRight = obstacleX + this.OBSTACLE_WIDTH;
    const gapTop = gapY;
    const gapBottom = gapY + gapHeight;

    // Ground and ceiling collision
    if (pandaBottom >= screenHeight - 50 || pandaTop <= 0) {
      return true;
    }

    // Obstacle collision
    if (pandaRight > obstacleLeft && pandaLeft < obstacleRight) {
      if (pandaTop < gapTop || pandaBottom > gapBottom) {
        return true;
      }
    }

    return false;
  }

  static shouldScore(pandaX: number, obstacleX: number): boolean {
    return pandaX > obstacleX + this.OBSTACLE_WIDTH;
  }

  static calculateDifficulty(score: number): { speed: number; gapHeight: number } {
    const speed = Math.min(
      this.INITIAL_SPEED + Math.floor(score / 5) * this.SPEED_INCREMENT,
      this.MAX_SPEED
    );
    
    const gapHeight = Math.max(150, 220 - Math.floor(score / 10) * 10);
    
    return { speed, gapHeight };
  }
}