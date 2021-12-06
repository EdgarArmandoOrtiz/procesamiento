
import { ImageType } from "./ImageType.js";
import { Matrix } from '@felipeaamacedo/matrix-ts';
import { inv } from '@felipeaamacedo/matrix-ts';
import { multiply } from '@felipeaamacedo/matrix-ts'

export class MathImg {

  public static initArray(width: number, height: number): any {
    var arrImage = new Array(3);
    arrImage[0] = new Array(height);
    arrImage[1] = new Array(height);
    arrImage[2] = new Array(height);
    for (let i = 0; i < height; i++) {
      arrImage[0][i] = new Array(width);
      arrImage[1][i] = new Array(width);
      arrImage[2][i] = new Array(width);
    }
    return arrImage;
  }

  public static conX(i: number, j: number, cs: Matrix) {
    //let res = cs.data[0][0] * j + cs.data[1][0] * i + cs.data[3][0] * i * j + cs.data[3][0];
   // console.log(i,j);
   // console.log(cs.data[0][0], cs.data[1][0], cs.data[2][0],cs.data[3][0] );
    //console.log(cs.data[0][1]* i );
		return Math.floor(cs.data[0][0] * j + cs.data[1][0] * i + cs.data[2][0]*i*j + cs.data[3][0]);
	}
 	/*public static conY(i:number,j : number, cs: Matrix){
    return Math.floor(cs.data[1][0] * j + cs.data[1][1] * i + cs.data[1][2]*i*j + cs.data[1][3]);
  }*/
  //aqui va ir el codigo de la trasnformacion bilineal  
  public static bilineal(img: ImageType, puntos_a: number[][]): number[][][] {
    //variable que guarda el arreglo 3d de la imagen de color
    var arrImage = img.getArrayImg();
    //variable donde guardamos la salida
    var sal = this.initArray(img.getWidth(), img.getHeight());
    const x1a: number = 0,                  y1a: number = 0,  
        x2a: number = img.getWidth() - 1, y2a: number = 0,
        x3a: number = img.getWidth() - 1, y3a: number = img.getHeight() - 1,
        x4a: number = 0,                  y4a: number = img.getHeight() - 1;
    
    const x1r=puntos_a[0][0],  y1r=puntos_a[1][0], x2r=puntos_a[0][1],   y2r=puntos_a[1][0], 
      x3r = puntos_a[0][2], y3r = puntos_a[1][2], x4r = puntos_a[0][3], y4r = puntos_a[1][3];
    
    let matA:Matrix =  new Matrix(4,4)
    matA.data = [
      [x1a, y1a, x1a * y1a, 1],
      [x2a, y2a, x2a * y2a, 1],  
      [x3a, y3a, x3a * y3a, 1],   
      [x4a, y4a, x4a * y4a, 1]  
    ];
    
    let vecX = new Matrix(4, 1);
    vecX.data =  [
      [x1r],
      [x2r],
      [x3r],
      [x4r]
    ];
    
    let vecY = new Matrix(4, 1);
    vecY.data = [
      [y1r],
      [y2r],
      [y3r],
      [y4r]
    ]; 

    let C1 = multiply(inv(matA), vecX);
    let C2 = multiply( inv(matA), vecY);

    let posi: number, posj:number;
        //float coef[][] = matrizDeC(xd0, yd0, xd1, yd1, xd2, yd2, xSI,ySI, xSD, ySD, xII, yII );
        
        for(let i=0; i< img.getHeight(); i++)     
        {
            for(let j=0; j<img.getWidth(); j++)
            {              
              posj = this.conX(i, j, C1);
              posi = this.conX(i, j, C2);
    
              if ((posj >= 0 && posj <= img.getWidth() - 1) && (posi >= 0 && posi <= img.getHeight() - 1)) {
                sal[0][i][j] = arrImage[0][posi][posj];
                sal[1][i][j] = arrImage[1][posi][posj];
                sal[2][i][j] = arrImage[2][posi][posj];
                }
            }
        }     
      //console.log(sal)

    return sal;
  }
  

}
