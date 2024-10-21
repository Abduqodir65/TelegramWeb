import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

enum MessageType {
    message = 'message',
    joined = 'joined',
}

interface UserMessageType {
    id: number;
    message: string;
    type: MessageType;
    createdAt: string;
    userId: number;
    user?: User;
}

interface User {
    id: number;
    name: string;
}

const users: User[] = [];
const messages: UserMessageType[] = [];

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('messages')
    handleMessage(@MessageBody() data: any) {
        const newMessage: UserMessageType = {
            id: messages.at(-1)?.id + 1 || 1,
            createdAt: new Date().toTimeString().slice(0, 8),
            message: data.message,
            type: MessageType.message,
            userId: data.userId,
        };
        const foundedUser = users.find((u) => u.id == data.userId);
        newMessage.user = foundedUser;
        messages.push(newMessage);

        this.server.emit('messages', messages);
    }

    @SubscribeMessage('typing')
    handleTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        client.broadcast.emit('typing', { user: data.user });
    }

    @SubscribeMessage('joined')
    handleJoin(@MessageBody() data: any) {
        const newUser: User = { id: users.at(-1)?.id + 1 || 1, name: data.user };
        users.push(newUser);

        const newMessage: UserMessageType = {
            id: messages.at(-1)?.id + 1 || 1,
            createdAt: new Date().toTimeString().slice(0, 8),
            message: `${newUser.name} joined the chat`,
            type: MessageType.joined,
            userId: newUser.id,
        };

        messages.push(newMessage);

        messages.forEach((m) => {
            const foundedUser = users.find((u) => u.id == m.userId);
            m.user = foundedUser;
        });

        this.server.emit('messages', messages);
        this.server.emit('joined', { user: data.user, id: newUser.id });
    }
}