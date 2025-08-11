# Socket.IO Best Practices

This document outlines best practices for using Socket.IO in this project to ensure a stable, performant, and maintainable application. Following these guidelines will help prevent common issues like memory leaks, redundant listeners, and unnecessary reconnections.

## 1. Single Socket Connection (Client-Side)

**The Problem:** Creating multiple socket instances on the client for a single user wastes resources, causes complex state management, and results in multiple `socket.id` values for the same user, breaking server-side logic that relies on a unique ID.

**The Solution:**
- **Use a Singleton Pattern with React Context:** As implemented in this refactor, the client application should create a single, shared `socket` instance. This instance is provided to the entire component tree via a React Context (`SocketContext`).
- **`useSocket` Hook:** A custom hook (`useSocket`) should be used by components to access the shared socket instance from the context. This hook should **not** create a new connection but only consume the context.

**Example:**
```javascript
// src/contexts/SocketContext.tsx
// The provider initializes the socket once.
export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={{ socket }}>
    {children}
  </SocketContext.Provider>
);

// src/hooks/useSocket.ts
// The hook provides access to the single instance.
export const useSocket = () => useContext(SocketContext);

// src/components/MyComponent.tsx
// A component uses the hook.
const MyComponent = () => {
  const socket = useSocket();
  // ...
};
```

## 2. Managing Event Listeners (Client-Side)

**The Problem:** In React, components mount and unmount. If a component adds a socket listener in a `useEffect` hook without cleaning it up, a new listener will be added every time the component re-mounts. This leads to the same event being handled multiple times, causing bugs and memory leaks.

**The Solution:**
- **Always Clean Up Listeners:** The `useEffect` hook in React returns an optional cleanup function. This function is the perfect place to remove the event listener using `socket.off('event-name')`.

**Example:**
```javascript
useEffect(() => {
  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  socket.on('new_message', handleNewMessage);

  // The cleanup function
  return () => {
    socket.off('new_message', handleNewMessage);
  };
}, [socket]); // Dependency array ensures this runs only when the socket instance changes.
```

## 3. Centralized Event Handling (Server-Side)

**The Problem:** Placing all socket event handling logic for every event inside the main `io.on('connection', ...)` callback becomes unmanageable as the application grows.

**The Solution:**
- **Modular Handlers:** As implemented in this refactor, event handlers should be broken down into separate modules based on functionality (e.g., `messagingHandler.ts`, `teamHandler.ts`).
- **Centralized Registration:** A single file (`socket/index.ts`) should be responsible for registering these modular handlers for each new socket connection. This keeps the main connection logic clean and organized.

**Example:**
```javascript
// src/socket/handlers/messagingHandler.ts
export const setupMessagingHandlers = (socket, io) => {
  socket.on('send_message', (data) => { /* ... */ });
};

// src/socket/index.ts
import { setupMessagingHandlers } from './handlers/messagingHandler';

io.on('connection', (socket) => {
  setupMessagingHandlers(socket, io);
  // ... register other handlers
});
```

## 4. Avoiding Unnecessary Reconnections

**The Problem:** By default, the Socket.IO client will try to reconnect automatically if it gets disconnected. While this is often desired, frequent, uncontrolled reconnections can spam the server, especially if the disconnection is intentional (e.g., user logs out).

**The Solution:**
- **Manual Connection Control:** Instead of relying on the automatic connection, manage the connection manually.
  - Call `socket.connect()` explicitly when the user is authenticated and needs a connection.
  - Call `socket.disconnect()` when the user logs out or the connection is no longer needed.
- **Disable Auto-Connect:** You can prevent the socket from connecting automatically on initialization.

**Example:**
```javascript
// src/socket/index.ts (Client-side)
export const socket = io({
  autoConnect: false // Important!
});

// When user logs in:
socket.auth = { token: userToken };
socket.connect();

// When user logs out:
socket.disconnect();
```

By adhering to these practices, the application's Socket.IO architecture will remain robust, scalable, and free of common pitfalls.
