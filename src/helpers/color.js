export const rgbToHex = rgb => {
  let split = rgb.match(/\(([\s\S]+)\)/);
  if (split) {
    return split[1].split(",").reduce((ret, curr) => {
      return (
        ret +
        parseInt(curr)
          .toString(16)
          .padStart(2, "0")
      );
    }, "#");
  }
};

export const hexToRgb = (hex, opacity) => {
  if (hex.startsWith("#") && hex.length === 7) {
    let r = hex.substr(1, 2);
    let g = hex.substr(3, 2);
    let b = hex.substr(5, 2);
    return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${
      opacity ? opacity : 1
    })`;
  }
};
