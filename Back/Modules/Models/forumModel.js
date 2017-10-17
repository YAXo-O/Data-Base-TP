function getForum()
{
    return{
        posts: 0, // Number (int64)
        slug: "", // String *
        threads: 0, // Number (int32)
        title: "", // String *
        user: "" // String *
    };
}


module.exports.getForum = getForum;