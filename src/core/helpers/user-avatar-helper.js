export function getUserAvatarUrl(apiEndPoint, userId) {
  return `${apiEndPoint}/photo/${userId}`;
}
