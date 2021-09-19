// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;

var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = sepiaFilter(imgIn);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg);
  return resultImg;
}
function sepiaFilter(img){

  imgOut = createImage(imgIn.width, imgIn.height);

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < imgOut.width; x++) {
      for (var y = 0; y < imgOut.height; y++) {

          var index = (x + y * imgOut.width) * 4;

          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];



          imgOut.pixels[index + 0] = (r * .393) + (g *.769) + (b * .189);
          imgOut.pixels[index + 1] = (r * .349) + (g *.686) + (b * .168);
          imgOut.pixels[index + 2] = (r * .272) + (g *.534) + (b * .131);
          imgOut.pixels[index + 3] = 255;
      }
  }
  imgOut.updatePixels();
  return imgOut;
}

/////////////////////////////////////////////////////////////////////////////////

function darkCorners(img){

  imgOut = createImage(imgIn.width, imgIn.height);

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < imgOut.width; x++) {
      for (var y = 0; y < imgOut.height; y++) {
          
          //calculate distance from center and implement constrain
          d = dist(img.width/2, img.height/2, x, y);
          d = constrain(d,300,750);
          
          //map distance to scale 
          dynLum = map(d, 300,750,1,0);
          
          var index = (x + y * imgOut.width) * 4;
          
          imgOut.pixels[index + 0] = dynLum*img.pixels[index+0];
          imgOut.pixels[index + 1] = dynLum*img.pixels[index+1];
          imgOut.pixels[index + 2] = dynLum*img.pixels[index+2];
          imgOut.pixels[index + 3] = 255;

      }
  }
  imgOut.updatePixels();
  return imgOut;
  
}

////////////////////////////////////////////////////////////////////////////

function radialBlurFilter(img){
  var imgOut = createImage(img.width, img.height);
  var matrixSize = matrix.length;

  imgOut.loadPixels();
  img.loadPixels();

  // read every pixel
  for (var x = 0; x < imgOut.width; x++) {
      for (var y = 0; y < imgOut.height; y++) {

          var index = (x + y * imgOut.width) * 4;
          var c = convolution(x, y, matrix, matrixSize, img);

          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];

          //calculate distance from pixel to mouse and implement constrain
          var d = dist(mouseX, mouseY, x, y);
          d = constrain(d,100,300);
          dynBlur = map(d,100,300,0,1);
      

          imgOut.pixels[index + 0] = c[0]*dynBlur + r*(1-dynBlur);
          imgOut.pixels[index + 1] = c[1]*dynBlur + r*(1-dynBlur);
          imgOut.pixels[index + 2] = c[2]*dynBlur + r*(1-dynBlur);
          imgOut.pixels[index + 3] = 255;
      }
  }
  imgOut.updatePixels();
  return imgOut;
}

function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}

////////////////////////////////////////////////////

function borderFilter(img){

  var buffer = createGraphics(img.width, img.height);
  buffer.background(img);
  buffer.noFill();
  buffer.strokeWeight(20);
  buffer.stroke(255);
  buffer.rect(0,0,img.width,img.height,60,60,60,60);
  buffer.rect(0,0,img.width,img.height,0,0,0,0);
  return buffer;
}