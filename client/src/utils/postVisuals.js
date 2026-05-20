const FALLBACKS = {
  movie:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
  show:
    "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1400&q=80",
  anime:
    "https://images.unsplash.com/photo-1612036782180-6f0822045d16?auto=format&fit=crop&w=1400&q=80"
};

export const getPostImage = (post) => {
  if (post?.imageUrl && String(post.imageUrl).trim()) {
    return post.imageUrl;
  }

  return FALLBACKS[post?.type] || FALLBACKS.movie;
};
