import { ImageLocal } from "./ImageLocal.js";
import { ImageType } from "./ImageType.js";
import { MathImg } from "./MathImg.js";
var lienzo1;
var lienzo2;
var pantalla1;
var pantalla2;
var cont = 0;
/* Este evento controla la forma de abrir un archivo mediante el evento de arrastrar y soltar */
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault(); //que no se abra en otra ventana sola la imagen
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
/** Variables que controla el canvas de la imagen, el primero
 * posteriormemte se volveran arreglos cuando ya controlemos las seis ventanas de nuestro frame
*/
lienzo1 = document.getElementById('img1');
pantalla1 = lienzo1.getContext("2d");
lienzo2 = document.getElementById('img2');
pantalla2 = lienzo2.getContext("2d");
var dropZone = lienzo1; //document.getElementById('img1');
var imgLocal = new ImageLocal(pantalla1);
imgLocal.getImage().onload = imgLocal.onload;
//lienzo1.addEventListener('mousemove', handleMouse);
lienzo1.addEventListener("mousemove", imgLocal.drawSmallImg);
document.getElementById('files').addEventListener('change', imgLocal.handleFileSelect, false);
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', imgLocal.handleFileSelect, false);
function bilinealImg(evt) {
    alert('Presion click en las 4 esquinas de la imagen');
    lienzo1.addEventListener('click', imgLocal.dibujarCanvas);
    lienzo1.addEventListener('click', selecccionarSca);
    lienzo1.removeEventListener("mousemove", imgLocal.drawSmallImg);
}
function selecccionarSca(evt) {
    cont += 1;
    if (cont == 4) {
        var imagenSal = new ImageType(pantalla1, imgLocal.getImage());
        console.log(imgLocal.matrizBilinial);
        imagenSal.imageArray2DtoData(pantalla2, MathImg.bilineal(imagenSal, imgLocal.matrizBilinial));
        cont = 0;
        lienzo1.removeEventListener('click', imgLocal.dibujarCanvas);
        lienzo1.removeEventListener('click', selecccionarSca);
        lienzo1.addEventListener("mousemove", imgLocal.drawSmallImg);
    }
}
//geometrica
document.getElementById("op-bilineal").addEventListener('click', bilinealImg, false);
