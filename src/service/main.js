import IcWebSocket, { generateRandomIdentity } from "ic-websocket-js";
import { canisterId, tswaanda_backend } from "../declarations/tswaanda_backend";

// WebSocket Setup
const gatewayUrl = "ws://127.0.0.1:8080"; // Local test URL
const icUrl = "http://127.0.0.1:4943"; // Local test network URL

export const ws = new IcWebSocket(gatewayUrl, undefined, {
  canisterId: canisterId,
  canisterActor: tswaanda_backend,
  identity: generateRandomIdentity(),
  networkUrl: icUrl,
});

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service_worker.js")
      .then(registration => {
        console.log("Service Worker registered: ", registration);
      })
      .catch(registrationError => {
        console.log("Service Worker registration failed: ", registrationError);
      });
  });
}

let isPermitted = false;

// Notification Permission Request
const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      isPermitted = true;
    } else {
      throw new Error('Permission not granted for Notifications');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error.message);
  }
}

// WebSocket Message Handling
export const handleWebSocketMessage = async (event) => {
  if (!isPermitted) {
    await requestPermission();
  }
  if (Notification.permission === 'granted') {
    console.log(event.data)
    const data = event.data
    const title = 'New Message'; 
    const options = {
      body: data.message, 
      icon: '../../assets/logo.png' 
    }

    // Sending a message to the service worker to show a notification
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: title,
        options: options
      });
    } else {
      console.error('Service worker controller not available');
    }
  }
}