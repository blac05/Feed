const { publicUser } = require("./user.model");

function enrichPost(post, db) {
  const author = db.users.find((user) => user.id === post.authorId);
  return { ...post, author: publicUser(author) };
}

module.exports = { enrichPost };
