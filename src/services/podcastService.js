import Podcast from "../models/Podcast.js";
import PodcastEpisode from "../models/PodcastEpisode.js";

export const createPodcast =
data => Podcast.create(data);

export const getPodcasts =
() =>
  Podcast.find()
  .populate(
    "creator",
    "username avatar"
  );

export const createEpisode =
data =>
  PodcastEpisode.create(data);

export const getEpisodes =
podcastId =>
  PodcastEpisode.find({
    podcast:podcastId
  });
