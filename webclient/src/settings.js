// cannon.js for physics
import * as CANNON from 'cannon-es';

export const ONE_DEGREE = Math.PI / 180;
export const ONE_DEGREE_RAD = 1.047197551 / 60;  // 1° in Radiant * 60 (rad per sec and 60hz)
export const QUARTER_DEGREE = Math.PI / 180 / 4;
export const QUARTER_DEGREE_RAD = 0.261799388 / 60; // 0.25° in Radiant * 60 (rad per sec and 60hz)

// INCREASE SPEED OF ROBOT-MOTORS
export const ROBOT_SPEED = 4

// INCREASE EVERYTHING INCLUDING PHYSICS == FAST FORWARD
export let FAST_FORWARD_FACTOR = 1;

export const SET_FAST_FORWARD_FACTOR = (newFactor) => {
    FAST_FORWARD_FACTOR = newFactor;
}

// REDUCE FPS BY FACTOR fpsLimiter: 1 === 60FPS (noLimit), 2 === 30fps, 30 === 2fps etc
export let REDUCE_FPS_FACTOR = 1;

// CANNON TIME STEP HAS TO BE SET SEPERATELY: FPS FROM THREE / ROBOT_SPEED / FAST_FORWARD_FACTOR
export let CANNON_WORLD_TIME_STEP = 1 / 60 / ROBOT_SPEED * FAST_FORWARD_FACTOR;

export const GRAVITY_VEC = new CANNON.Vec3(0, -9.82, 0); // m/s²

// ---
// DESIGN RELATED
export const COLORS = [0x223366, 0xcc7722, 0x444422, 0x992222, 0x999999]