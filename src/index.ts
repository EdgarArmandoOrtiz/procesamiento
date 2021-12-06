
import { ImageLocal } from "./ImageLocal.js";
import { ImageType } from "./ImageType.js";
import { MathImg } from "./MathImg.js";

let lienzo1: HTMLCanvasElement;
let lienzo2: HTMLCanvasElement;
let pantalla1: CanvasRenderingContext2D;
let pantalla2: CanvasRenderingContext2D;
let contador:number=0;

/* Este evento controla la forma de abrir un archivo mediante el evento de arrastrar y soltar */
function handleDragOver(evt:any) {
    evt.stopPropagation();
    evt.preventDefault(); //que no se abra en otra ventana sola la imagen
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

  /** Variables que controla el canvas de la imagen, el primero 
   * posteriormemte se volveran arreglos cuando ya controlemos las seis ventanas de nuestro frame
  */
lienzo1 = <HTMLCanvasElement>document.getElementById('img1');
pantalla1 = lienzo1.getContext("2d");
lienzo2 = <HTMLCanvasElement>document.getElementById('img2');
pantalla2 = lienzo2.getContext("2d");

var dropZone = lienzo1;//document.getElementById('img1');
var imgLocal: ImageLocal = new ImageLocal(pantalla1);
imgLocal.getImage().onload = imgLocal.onload;

//lienzo1.addEventListener('mousemove', handleMouse);
 
lienzo1.addEventListener("mousemove", imgLocal.drawSmallImg);
document.getElementById('files').addEventListener('change', imgLocal.handleFileSelect, false);
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', imgLocal.handleFileSelect, false);

function bilinealImg(evt: any): void{
  alert('Da click en las 4 esquinas de la imagen');
  lienzo1.addEventListener('click',imgLocal.drawArea);
  lienzo1.addEventListener('click',clickearCanvas);
  lienzo1.removeEventListener("mousemove", imgLocal.drawSmallImg);
}

function clickearCanvas(evt:any):void{
  contador+=1;
  if(contador==4){
  var imagenSal: ImageType = new ImageType(pantalla1, imgLocal.getImage());
  console.log(imgLocal.bili);
  imagenSal.imageArray2DtoData(pantalla2, MathImg.bilineal(imagenSal, imgLocal.bili));
  contador=0;
  lienzo1.removeEventListener('click',imgLocal.drawArea);
  lienzo1.removeEventListener('click',clickearCanvas);
  lienzo1.addEventListener("mousemove", imgLocal.drawSmallImg);
  }
}
//geometrica
document.getElementById("op-bilineal").addEventListener('click', bilinealImg, false);
