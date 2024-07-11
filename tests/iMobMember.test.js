//validation test, using trim can take care of spaces either side of the
//entries it would remove them before the user entered it.
const mongoose = require('mongoose');
const iMobMember = require('./iMobMember');

describe('iMobMember Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/test_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('create & save iMobMember successfully', async () => {
        const validMember = new iMobMember({
            FirstName: 'Justin',
            LastName: 'Trudeau',
            UserName: 'J_Trudeau',
            Email: 'Justin.Trudeau@example.com',
            Password: 'password123'
        });
        const savedMember = await validMember.save();
        expect(savedMember._id).toBeDefined();
        expect(savedMember.FirstName).toBe('Justin');
        expect(savedMember.LastName).toBe('Trudeau');
        expect(savedMember.UserName).toBe('J_Trudeau');
        expect(savedMember.Email).toBe('Justin.Trudeau');
    });

    it('insert member successfully, but the field not defined in schema should be undefined', async () => {
        const memberWithInvalidField = new iMobMember({
            FirstName: 'Justin',
            LastName: 'Trudeau',
            UserName: 'J_Trudeau',
            Email: 'Justin.Trudeau@example.com',
            Password: 'password123'
            Nickname: 'BlackFaceKing'
        });
        const savedMemberWithInvalidField = await memberWithInvalidField.save();
        expect(savedMemberWithInvalidField._id).toBeDefined();
        expect(savedMemberWithInvalidField.Nickname).toBeUndefined();
    });

    it('create member without required field should fail', async () => {
        const memberWithoutRequiredField = new iMobMember({
            FirstName: 'Justin'
        });
        let err;
        try {
            const savedMemberWithoutRequiredField = await memberWithoutRequiredField.save();
            err = savedMemberWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.LastName).toBeDefined();
        expect(err.errors.UserName).toBeDefined();
        expect(err.errors.Email).toBeDefined();
        expect(err.errors.Password).toBeDefined();
    });
});
