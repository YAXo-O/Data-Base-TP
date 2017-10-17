function getThread()
{
    return {
        author: "", // String *
        created: "", // String (data-time)
        forum: "", // String
        id: 0, // Number (int32)
        message: "", // String (text) *
        slug: "", // String
        title: "", // String (text) *
        votes: 0 // Number (int32)
    };
}


module.exports.getThread = getThread;