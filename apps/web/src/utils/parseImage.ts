export default function parseImage(image: string) {
  const imageArray = JSON.parse(image);
  if (Array.isArray(imageArray)) {
    return imageArray;
  }
  return [image];
}
