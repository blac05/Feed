export const generateCaption =
async text => {

  const captions = [
    `✨ ${text}`,
    `🔥 ${text}`,
    `🚀 ${text}`,
    `💯 ${text}`
  ];

  return captions[
    Math.floor(
      Math.random() *
      captions.length
    )
  ];
};
