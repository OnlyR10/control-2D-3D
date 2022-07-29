/**
 *
 * @param { {x: number; y: number; z: number } } from - the initial position of the object in X, Y, Z coordinates
 * @param { {x: number; y: number; z: number } } to - end position of the object in X, Y, Z coordinates
 * @param { number } duration - duration in second between steps
 * @param { number } speed - speed in pixels per second
 * @returns { Array<[x: number, y: number, z: number, t: number]>} Array of steps
 */
function moveTo(from, to, duration, speed) {
  let positionX = from.x;
  let positionY = from.y;
  let positionZ = from.z;
  const distanceX = to.x - from.x;
  const distanceY = to.y - from.y;
  const distanceZ = to.z - from.z;
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2 + distanceZ ** 2);
  const stepDistance = duration * speed;
  const remainderOfTheDistance = distance % stepDistance;
  const numberOfSteps = distance / stepDistance;
  let currentTime = 0;
  const result = [];

  for (let i = 0; i <= distance; i += stepDistance) {
    if (i !== 0) {
      positionX += distanceX / numberOfSteps;
      positionY += distanceY / numberOfSteps;
      positionZ += distanceZ / numberOfSteps;
      currentTime += duration;
    }
    result.push({ x: positionX, y: positionY, z: positionZ, t: currentTime });
  }

  if (remainderOfTheDistance) {
    result.push({ x: to.x, y: to.y, z: to.z, t: currentTime + remainderOfTheDistance / speed });
  }

  return result;
}

// console.log(moveTo({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 8 }, 1, 2));

/**
 *
 * @param { Array<number> } vector - vector coordinates
 * @param { { alpha: number; beta: number; gamma: number } } angels - rotation angles
 * @returns { Array<number> } resulting vector
 */
function turnTo(coordinates, { alpha, beta, gamma }) {
  const rotationMatrix = [
    [
      Math.cos(alpha) * Math.cos(gamma) - Math.cos(beta) * Math.sin(alpha) * Math.sin(gamma),
      -Math.cos(gamma) * Math.sin(alpha) - Math.cos(alpha) * Math.cos(beta) * Math.sin(gamma),
      Math.sin(beta) * Math.sin(gamma),
    ],
    [
      Math.cos(beta) * Math.cos(gamma) * Math.sin(alpha) + Math.cos(alpha) * Math.sin(gamma),
      Math.cos(alpha) * Math.cos(beta) * Math.cos(gamma) - Math.sin(alpha) * Math.sin(gamma),
      -Math.cos(gamma) * Math.sin(beta),
    ],
    [Math.sin(alpha) * Math.sin(beta), Math.cos(alpha) * Math.sin(beta), Math.cos(beta)],
  ];

  const resultingVector = [
    rotationMatrix[0][0] * coordinates[0] +
      rotationMatrix[0][1] * coordinates[1] +
      rotationMatrix[0][2] * coordinates[2],
    rotationMatrix[1][0] * coordinates[0] +
      rotationMatrix[1][1] * coordinates[1] +
      rotationMatrix[1][2] * coordinates[2],
    rotationMatrix[2][0] * coordinates[0] +
      rotationMatrix[2][1] * coordinates[1] +
      rotationMatrix[2][2] * coordinates[2],
  ];

  return resultingVector;
}

console.log(turnTo([2, 3, 4], { alpha: -30, beta: 10, gamma: 20 }));
