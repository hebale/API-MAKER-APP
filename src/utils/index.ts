import React from 'react';

export const decodeUnicode = (str: string) => {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
};

export const inputFileReader = (
  file: File,
  exts: string[],
  onSucess: (props: any) => void,
  onError: (props: any) => void
) => {
  const reader = new FileReader();

  const ext = file.name
    .substring(file.name.lastIndexOf('.') + 1, file.name.length)
    .toLowerCase();

  if (exts.indexOf(ext) === -1) {
    return onError(`파일 확장자를 확인해주세요. (${exts.join(', ')})`);
  }

  if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
    reader.readAsDataURL(file);
  } else {
    reader.readAsText(file);
  }

  reader.onload = () => {
    const { name, size } = file;

    onSucess({
      name,
      size,
      data: reader.result,
    });
  };

  reader.onerror = (err) => {
    onError(`다시 시도해주세요. (${err})`);
  };
};

export const objectToString = (params: {
  [key: string]: string | number | boolean;
}) => {
  return Object.keys(params)
    .map((value) => `${value}=${params[value]}`)
    .join('&');
};

export const highlightMarker = (
  str: string,
  word: string
): (string | React.ReactElement)[] => {
  if (str.indexOf(word) === -1 || !word) return [str];
  const splitStr = str.split(word);

  return splitStr.reduce(
    (aggr: (string | React.ReactElement)[], str, index) => {
      if (index !== splitStr.length - 1) {
        aggr = [
          ...aggr,
          splitStr[index],
          React.createElement('mark', { key: index }, word),
        ];
      } else {
        aggr = [...aggr, splitStr[index]];
      }

      return aggr;
    },
    []
  );
};

export const throttle = (cb: () => void, delay: number) => {};

export const debounce = (cb: (...args: any) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (...args: any) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      cb.apply(null, args);
      timer = null;
    }, delay);
  };
};

export const deepClone = (data: any) => {
  if (typeof data !== 'object' || typeof data === 'function' || data === null)
    return data;

  let base = Array.isArray(data) ? [] : {};

  for (let key of Object.keys(data)) {
    base[key] = deepClone(data[key]);
  }
  return base;
};

export const isSameData = (a: any, b: any) => {
  let status = true;

  const checkData = (a: any, b: any) => {
    if (typeof a === 'function') {
      if (a.toString() !== b.toString()) {
        status = false;
      }
      return;
    }
    if (typeof a !== 'object' || a === null) {
      if (a !== b) status = false;
      return;
    }
    for (let key of Object.keys(a)) {
      if (!b.hasOwnProperty(key)) {
        status = false;
        return;
      }
      checkData(a[key], b[key]);
    }
  };

  checkData(a, b);
  return status;
};
