let socket;

export const connectWebSocket = (onMessage) => {
  socket = new WebSocket("ws://localhost:8000/ws/events");

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("📨 WebSocket message:", data);
    if (onMessage) onMessage(data);
  };

  socket.onclose = () => {
    console.log("❌ WebSocket disconnected");
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
