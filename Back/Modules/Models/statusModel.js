function getStatus()
{
    return {
        forum: 0, // Number (int32) *
        post: 0, // Number (int64) *
        thread: 0, // Number (int32) *
        user: 0 // Number (int32) *
    };
}

module.exports.getStatus = getStatus;