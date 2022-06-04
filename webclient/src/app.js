import _ from 'lodash';
import './style.css'

import ThreeMain from "./threeFiles/threeMain.js";
import { scene } from "./threeFiles/threeMain.js";
import WsClient from './websocketClient.js';

function component() {
    const element = document.createElement('h1');
    return element;
}

document.body.appendChild(component());

const wsClient = new WsClient();

export {
    wsClient as wsClient
}