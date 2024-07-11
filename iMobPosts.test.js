const mongoose = require("mongoose");
const iMobPosts = require("./iMobPosts");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), options);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("iMobPosts Model Test", () => {
    it("create & save iMobPosts successfully", async () => {
        const validPost = new iMobPosts({
            content: "This is a test post",
            authoredBy: new mongoose.Types.ObjectId(),
            Capping: true,
            cosignFromMembers: [new mongoose.Types.ObjectId()],
            cosignData: new mongoose.Types.ObjectId(),
            commentOn: new mongoose.Types.ObjectId(),
            comments: [new mongoose.Types.ObjectId()],
            crowns: [new mongoose.Types.ObjectId()],
        });
        const savedPost = await validPost.save();
        expect(savedPost._id).toBeDefined();
        expect(savedPost.content).toBe(validPost.content);
        expect(savedPost.Capping).toBe(validPost.Capping);
        expect(savedPost.cosignFromMembers).toEqual(validPost.cosignFromMembers);
        expect(savedPost.cosignData).toBe(validPost.cosignData);
        expect(savedPost.commentOn).toBe(validPost.commentOn);
        expect(savedPost.comments).toEqual(validPost.comments);
        expect(savedPost.crowns).toEqual(validPost.crowns);
    });

    it("insert iMobPosts successfully, but the field does not defined in schema should be undefined", async () => {
        const postWithInvalidField = new iMobPosts({
            content: "This is a test post with invalid field",
            authoredBy: new mongoose.Types.ObjectId(),
            Capping: true,
            cosignFromMembers: [new mongoose.Types.ObjectId()],
            cosignData: new mongoose.Types.ObjectId(),
            commentOn: new mongoose.Types.ObjectId(),
            comments: [new mongoose.Types.ObjectId()],
            crowns: [new mongoose.Types.ObjectId()],
            invalidField: "some value",
        });
        const savedPostWithInvalidField = await postWithInvalidField.save();
        expect(savedPostWithInvalidField._id).toBeDefined();
        expect(savedPostWithInvalidField.invalidField).toBeUndefined();
    });

    it("create iMobPosts without required field should failed", async () => {
        const postWithoutRequiredField = new iMobPosts({ content: "This is a test post" });
        let err;
        try {
            await postWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.authoredBy).toBeDefined();
    });
});
