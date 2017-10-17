const getPost = require("./postModel.js").getPost;
const getUser = require("./userModel.js").getUser;
const getThread = require("./threadModel.js").getThread;
const getForum = require("./forumModel.js").getForum;

function getPostFull()
{
    return {
        author: getUser(),
        forum: getForum(),
        post: getPost(),
        thread: getThread()
    };
}

module.exports.getPostFull = getPostFull;