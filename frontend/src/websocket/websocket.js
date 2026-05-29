import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = 'http://localhost:8081/ws';

export const connectWebSocket = (onMessageReceived) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
        client.subscribe('/topic/notifications', (message) => {
            if (message.body) {
                onMessageReceived(JSON.parse(message.body));
            }
        });
    };

    client.activate();
    return client;
};
