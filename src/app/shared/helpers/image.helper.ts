export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const f = new FileReader();
    f.onloadend = e => resolve(e.target.result);
    f.onerror = e => reject(e);
    f.readAsDataURL(file);
  });
}
