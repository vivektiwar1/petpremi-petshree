export const dataURItoBlob = (dataURI) => {

  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const buffer = new ArrayBuffer(byteString.length);
  const data = new DataView(buffer);

  for (let i = 0; i < byteString.length; i++) {
    data.setUint8(i, byteString.charCodeAt(i));
  }

  return new Blob([buffer], {type: mimeString});
};
