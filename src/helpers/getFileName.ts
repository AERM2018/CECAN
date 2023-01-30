export const getFilePropsFromResponse = (headers: Headers) => {
  const filename = headers
    .get("content-disposition")
    .split(";")[1]
    .split("=")[1]
    .slice(1, -1);
  const type = headers.get("Content-Type");
  return { filename, type };
};
