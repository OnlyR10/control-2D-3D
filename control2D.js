/**
 *
 * @param { {x: number; y: number } } from - the initial position of the object in X and Y coordinates
 * @param { {x: number; y: number } } to - end position of the object in X and Y coordinates
 * @param { number } duration - duration in second between steps
 * @param { number } speed - speed in pixels per second
 * @returns { Array<[x: number, y: number, t: number]>} Array of steps
 * @example moveTo({ x: 1, y: 1 }, { x: 12, y: 1 }, 0.5, 2);
 */
function moveTo(from, to, duration, speed) {
  let positionX = from.x;
  let positionY = from.y;
  const distanceX = to.x - from.x;
  const distanceY = to.y - from.y;
  const distance = Math.hypot(distanceX, distanceY);
  const stepDistance = duration * speed;
  const remainderOfTheDistance = distance % stepDistance;
  const numberOfSteps = distance / stepDistance;
  let currentTime = 0;
  const result = [];

  for (let i = 0; i <= distance; i += stepDistance) {
    if (i !== 0) {
      positionX += distanceX / numberOfSteps;
      positionY += distanceY / numberOfSteps;
      currentTime += duration;
    }
    result.push({ x: positionX, y: positionY, t: currentTime });
  }

  if (remainderOfTheDistance) {
    result.push({ x: to.x, y: to.y, t: currentTime + remainderOfTheDistance / speed });
  }

  return result;
}

/**
 *
 * @param { number } from - the initial rotation of the object in radians
 * @param { number } to - end rotation of the object in radians
 * @param { number } duration - duration in second between steps
 * @param { number } speed - speed in radians per second
 * @returns { Array<[angle: number, t: number]>} Array of steps
 * @example turnTo(400, -400, 0.5, 60)
 */
function turnTo(from, to, duration, speed) {
  let currentRotation = from;
  const distanceRotation = Math.abs(to - from);
  const stepDistanceRotation = duration * speed;
  const remainderDistanceRotation = distanceRotation % stepDistanceRotation;
  let numberOfSteps = distanceRotation / stepDistanceRotation;
  if (to < from) {
    numberOfSteps *= -1;
  }
  let currentTime = 0;
  const result = [];

  for (let i = 0; i <= distanceRotation; i += stepDistanceRotation) {
    if (i !== 0) {
      currentRotation += distanceRotation / numberOfSteps;
      currentTime += duration;
    }
    result.push({ angle: normalizeAngle(currentRotation), t: currentTime });
  }

  if (remainderDistanceRotation) {
    result.push({ angle: normalizeAngle(to), t: currentTime + remainderDistanceRotation / speed });
  }

  return result;
}

function normalizeAngle(angle) {
  angle = angle % 360;
  if (angle < 0) {
    angle += 360;
  } else if (angle === 0) {
    angle = 0;
  }
  return angle;
}

/**
 *
 * @param { {x: number; y: number } } from - the initial position of the object in X and Y coordinates
 * @param { {x: number; y: number } } to - end position of the object in X and Y coordinates
 * @param { number } duration - duration in second between steps
 * @param { object } accelerationOptions
 * @param { number } accelerationOptions.speed - speed in pixels per second
 * @param { number } accelerationOptions.start - start of acceleration
 * @param { number } accelerationOptions.acceleration - acceleration step
 * @param { number } accelerationOptions.maxSpeed - maximum speed after acceleration
 * @param { number } accelerationOptions.end - end of acceleration
 * @param { number } accelerationOptions.deceleration - deceleration step
 * @returns { Array<[x: number, y: number, t: number]>} Array of steps
 * @example speedUpTo({ x: 1, y: 1 }, { x: 800, y: 1 }, 1 / 30, { speed: 1, maxSpeed: 5, acceleration: 2, deceleration: 2, start: 5, end: 15 });
 */
function speedUpTo(from, to, duration, accelerationOptions) {
  const findDistance = createFindDistance(accelerationOptions);

  let positionX = from.x;
  let positionY = from.y;

  const distanceX = to.x - from.x;
  const distanceY = to.y - from.y;

  const distance = Math.hypot(distanceX, distanceY);

  const result = [];
  let currentDistance = 0;

  for (let t = 0; currentDistance < distance; t += duration) {
    currentDistance = findDistance(t);
    if (currentDistance >= distance) {
      currentDistance = distance;
    }
    positionX = (currentDistance * distanceX) / distance + from.x;
    positionY = (currentDistance * distanceY) / distance + from.y;
    result.push({ x: positionX, y: positionY, t: t });
  }

  return result;
}

function createFindDistance({ speed, maxSpeed, acceleration, deceleration, start, end }) {
  return function findDistance(t) {
    const accelerationTime = start + (maxSpeed - speed) / acceleration;
    const decelerationTime = end + (maxSpeed - speed) / deceleration;
    const minimumSpeedDistance = speed * t;

    const accelerationTimeSpan = accelerationTime - start;
    const currentSpeedDuringAcceleration = acceleration * accelerationTimeSpan;
    const distanceWithAcceleration = (currentSpeedDuringAcceleration * accelerationTimeSpan) / 2;

    const maximumSpeedDistance = (end - accelerationTime) * (maxSpeed - speed);

    const decelerationTimeSpan = decelerationTime - end;
    const currentBrakingSpeed = deceleration * decelerationTimeSpan;
    const distanceWithDeceleration = (currentBrakingSpeed * decelerationTimeSpan) / 2;

    if (t < start) {
      return minimumSpeedDistance;
    }

    if (t < accelerationTime) {
      const accelerationTimeSpan = t - start;
      const currentSpeedDuringAcceleration = acceleration * accelerationTimeSpan;
      const distanceWithAcceleration = (currentSpeedDuringAcceleration * accelerationTimeSpan) / 2;
      return minimumSpeedDistance + distanceWithAcceleration;
    }

    if (t < end) {
      const maximumSpeedDistance = (t - accelerationTime) * (maxSpeed - speed);
      return minimumSpeedDistance + distanceWithAcceleration + maximumSpeedDistance;
    }

    if (t < decelerationTime) {
      const decelerationTimeSpan = t - end;
      const currentBrakingSpeed = deceleration * decelerationTimeSpan;
      const distanceWithDeceleration =
        (currentBrakingSpeed * decelerationTimeSpan) / 2 +
        (maxSpeed - currentBrakingSpeed - speed) * decelerationTimeSpan;

      return minimumSpeedDistance + distanceWithAcceleration + maximumSpeedDistance + distanceWithDeceleration;
    }

    return minimumSpeedDistance + distanceWithAcceleration + maximumSpeedDistance + distanceWithDeceleration;
  };
}
