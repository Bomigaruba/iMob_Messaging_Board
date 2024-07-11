const iMob = require('./iMob');

describe('iMob Integration Tests', () => {
    test('should send a message successfully', () => {
        const message = { user: 'User1', text: 'A Møøse once bit my sister' };
        const response = iMob.sendMessage(message);
        expect(response.status).toBe('success');
        expect(response.messageId).toBeDefined();
    });

    test('should retrieve messages successfully', () => {
        const messages = iMob.getMessages();
        expect(messages).toBeInstanceOf(Array);
        expect(messages.length).toBeGreaterThan(0);
        messages.forEach(msg => {
            expect(msg).toHaveProperty('user');
            expect(msg).toHaveProperty('text');
        });
    });

    test('should delete a message successfully', () => {
        const messageId = 'some-message-id';
        const response = iMob.deleteMessage(messageId);
        expect(response.status).toBe('success');
    });

    test('should update a message successfully', () => {
        const messageId = 'some-message-id';
        const updatedMessage = { text: 'Updated text' };
        const response = iMob.updateMessage(messageId, updatedMessage);
        expect(response.status).toBe('success');
    });
});
