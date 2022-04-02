const canvas = document.querySelector("canvas");
const input = document.querySelector("input");
const downloadButton = document.querySelector("button");

const baseColors = [
    '#BE0039',
    '#FF4500',
    '#FFA800',
    '#FFD635',
    '#00A368',
    '#00CC78',
    '#7EED56',
    '#00756F',
    '#009EAA',
    '#2450A4',
    '#3690EA',
    '#51E9F4',
    '#493AC1',
    '#6A5CFF',
    '#811E9F',
    '#B44AC0',
    '#FF3881',
    '#FF99AA',
    '#6D482F',
    '#9C6926',
    '#000000',
    '#898D90',
    '#D4D7D9',
    '#FFFFFF'
]

input.addEventListener("input", (event) => {
  const img = new Image();
  img.onload = () => draw(img);
  img.src = URL.createObjectURL(event.target.files[0]);
});

const draw = (image) => {
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data
  ctx.createImageData(canvas.width, canvas.height);
 
  for (let i = 0; i < data.length - 5; i += 4) {
    if (data[i + 3] < 255) {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
      data[i + 3] = 0
      continue
    }
    
    const soup = (value) => {
      let result = value.toString(16)
      
      if (result.length < 2) {
        result = `0${result}`
      }
      
      return result
    }

    let currentColor = `#${soup(data[i])}${soup(data[i + 1])}${soup(data[i + 2])}`
    let resolvedColor = nearestColor(currentColor)
        
    data[i] = parseInt(resolvedColor.substring(1, 3), 16);
    data[i + 1] = parseInt(resolvedColor.substring(3, 5), 16);
    data[i + 2] = parseInt(resolvedColor.substring(5), 16);
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
};


/////// 

// from https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Distance between 2 colors (in RGB)
// https://stackoverflow.com/questions/23990802/find-nearest-color-from-a-colors-list
function distance(a, b) {
    return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
}

// return nearest color from array
function nearestColor(colorHex){
  var lowest = Number.POSITIVE_INFINITY;
  var tmp;
  let index = 0;
  baseColors.forEach( (el, i) => {
      tmp = distance(hexToRgb(colorHex), hexToRgb(el))
      if (tmp < lowest) {
        lowest = tmp;
        index = i;
      };
      
  })
  return baseColors[index];
}

////

const downloadCanvas = () => {;
    let anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "IMAGE.PNG";
    anchor.click();

    anchor.parentElement.removeChild(anchor)
}

downloadButton.addEventListener('click', downloadCanvas)