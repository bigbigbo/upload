let now = Number(new Date());

export function uid() {
  return (now++).toString(36);
}

export function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}

export const deepCopy = (input) => {
  // 简单的递归深拷贝，只考虑 context 中 state 的复制，因此没有处理 function 等
  if (input instanceof Object) {
    if (Array.isArray(input)) {
      return input.map(deepCopy);
    }
    let output = {};
    Object.entries(input).forEach(([key, value]) => {
      output[key] = deepCopy(value);
    });
    return output;
  }
  return input;
};

export function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export function convertBase64UrlToFile(urlData, imgName) {
  const bytes = window.atob(urlData.split(',')[1]);

  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: 'image/jpeg' });

  return new File([blob], imgName + '.jpeg', { type: 'image/jpeg' });
}

export function byteConverMB(limit) {
  return (limit / (1024 * 1024)).toFixed(2);
}

export function isImgExt(ext) {
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
}
