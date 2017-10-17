const getError = require("./Models/errorModel.js").getError;
const getForum = require("./Models/forumModel.js").getForum;
const getPostFull = require("./Models/postFullModel.js").getPostFull;
const getPost = require("./Models/postModel.js").getPost;
const getPostUpdate = require("./Models/postUpdateModel.js").getPostUpdate;
const getStatus = require("./Models/statusModel.js").getStatus;
const getThread = require("./Models/threadModel.js").getThread;
const getThreadUpdate = require("./Models/threadUpdateModel.js").getThreadUpdate;
const getUser = require("./Models/userModel.js").getUser;
const getUserUpdate = require("./Models/userUpdateModel.js").getUserUpdate;
const getVote = require("./Models/voteModel.js").getVote;

class ModelsFactory
{
    static getErrorModel()
    {
        return getError();
    }

    static getForumModel()
    {
        return getForum();
    }

    static getPostFullModel()
    {
        return getPostFull;
    }

    static getPostModel()
    {
        return getPost();
    }

    static getPostUpdateModel()
    {
        return getPostUpdate();
    }

    static getStatusModel()
    {
        return getStatus();
    }

    static getThreadModel()
    {
        return getThread();
    }

    static getThreadUpdateModel()
    {
        return getThreadUpdate();
    }

    static getUserModel()
    {
        return getUser();
    }

    static getUserUpdateModel()
    {
        return getUserUpdate();
    }

    static getVoteModel()
    {
        return getVote();
    }
}

module.exports.ModelsFactory = ModelsFactory;
