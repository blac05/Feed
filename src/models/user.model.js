function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    avatarInitials: user.avatarInitials,
    bio: user.bio,
    dateOfBirth: user.dateOfBirth,
    wallpaperUrl: user.wallpaperUrl || "",
    verified: user.verified,
    followers: user.followers,
  };
}

module.exports = { publicUser };
