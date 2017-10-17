function getPost()
{
    return {
        author: "", // String *
        created: "", // String (date-time)
        forum: "", // String
        id: 0, // Number (int64)
        isEdited: false, // Bool
        message: "", // Text *
        parent: 0, // Number (int64)
        thread: 0 // Number (int32)
    };
}


module.exports.getPost = getPost;