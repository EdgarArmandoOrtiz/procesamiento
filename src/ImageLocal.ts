import { DefaultSettings } from "./DefaultSettings.js";
import { ImageOp } from "./ImageOp.js";

export class ImageLocal implements ImageOp {
  //atributos
  protected img: HTMLImageElement;
  protected screen: CanvasRenderingContext2D;
  protected readyToDraw: boolean;
  protected isScaled: boolean;
  public x1: number = null;
  public y1: number;
  public x2: number = null;
  public y2: number;
  public x3: number = null;
  public y3: number;
  public x4: number = null;
  public y4: number;
  public bili: number[][];
  // protected document: HTMLDocument;

  public constructor(p: CanvasRenderingContext2D, ready?: boolean){
    this.img = new Image();
    this.screen = p;
    // this.document = d;
    
    this.readyToDraw = ready;
    this.isScaled = false;
    this.drawSmallImg = this.drawSmallImg.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);  
    this.onload = this.onload.bind(this);  
    this.drawArea = this.drawArea.bind(this);
  }
    
  public handleFileSelect(evt:any):void {
    let files: any;
    
    if(evt.type === "drop") {
      evt.stopPropagation();
      evt.preventDefault();
      files = evt.dataTransfer.files;
    }
    if(evt.type === "change")
      files = evt.target.files; // FileList object
            
    // files is a FileList of File objects. List some properties.
    let output:any[] = [];
    //console.log(evt)
    let f:any = files[0];
    output.push('<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - ',
    f.size, ' bytes, last modified: ',
    f.lastModifiedDate.toLocaleDateString(), '</li>');
                
    this.img.src = f.name;      
    this.readyToDraw = true;  

    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';     
    this.onload();
  }

  public drawSmallImg(evt:any):void{
    let xPos:number = evt.offsetX-2;
    let yPos: number = evt.offsetY - 2;
    //console.log(xPos, yPos);
    let pixel:ImageData = this.screen.getImageData(xPos, yPos, 1, 1);
       
    if (this.readyToDraw) {    
      if (this.isScaled) {
        xPos *= (this.img.width/DefaultSettings.SIZE_WIDTH);
        yPos *= (this.img.height/DefaultSettings.SIZE_HEIGHT);
        
      }
      this.screen.clearRect(0, 0, DefaultSettings.SIZE_WIDTH, DefaultSettings.SIZE_HEIGHT);
      this.screen.strokeStyle = "cornflowerblue";
      
      this.screen.imageSmoothingEnabled = false;
      this.isScaled ?
          this.screen.drawImage(this.img, 0, 0, DefaultSettings.SIZE_WIDTH, DefaultSettings.SIZE_HEIGHT)
        : this.screen.drawImage(this.img, 0, 0, this.img.width, this.img.height);
      
      this.screen.strokeRect(evt.offsetX+5, evt.offsetY+5,  DefaultSettings.SMALL_W,DefaultSettings.SMALL_H);
      this.screen.drawImage(this.img, Math.floor(xPos - 3), Math.floor(yPos - 3), 5, 5, evt.offsetX + 5, evt.offsetY + 5, DefaultSettings.SMALL_W, DefaultSettings.SMALL_H);
      
      let color:HTMLElement = document.getElementById('color');
      
      let data:Uint8ClampedArray = pixel.data;
      let rgba = 'rgba(' + data[0] + ', ' + data[1] +
                ', ' + data[2] + ', ' + (data[3] / 255) + ')';
      color.style.background =  rgba;
      //color.textContent = rgba;

      document.getElementById('rgb').innerHTML = '<strong>'+ rgba + '</strong> ';
    }
  }
  public getImage():HTMLImageElement{
        return this.img;
  }
  public getScreen():CanvasRenderingContext2D{
    return this.screen;
  }

  public setScaled(v:boolean):void{
        this.isScaled = v;
  }
  public onload() {
    this.getScreen().clearRect(0, 0, DefaultSettings.SIZE_WIDTH, DefaultSettings.SIZE_HEIGHT);
    /** SI nuestro canvas es mas pequeño que la imagen se dibuja a su escala normal, 
     * si es mas grande se dibuja reescalado al ancho de ventana por default  */
    if (this.getImage().width > DefaultSettings.SIZE_WIDTH
      || this.getImage().height > DefaultSettings.SIZE_HEIGHT) {
      this.getScreen().drawImage(this.getImage(), 0, 0, DefaultSettings.SIZE_WIDTH, DefaultSettings.SIZE_HEIGHT);
      this.setScaled(true);
    }
    else {
      this.getScreen().drawImage(this.getImage(), 0, 0, this.getImage().width, this.getImage().height);
      this.setScaled(false);
    }
  }

  public drawArea(evt:any): void{
    let canvas:CanvasRenderingContext2D;
    let aux: number;
    canvas=this.screen;

    console.log('Funcion draw area');
    if(this.x1==null){
      this.x1 = evt.offsetX;
      this.y1 =evt.offsetY;
      console.log(this.x1,this.y1);
      this.screen.strokeStyle='blue';
      this.screen.lineWidth = 1;
      this.screen.beginPath();
      this.screen.moveTo(this.x1,this.y1);
    }else{
      if(this.x2==null){
        this.x2 = evt.offsetX;
        this.y2 = evt.offsetY;
        console.log(this.x2,this.y2);
        this.screen.lineTo(this.x2,this.y2);
        this.screen.stroke();
      }else{
        if(this.x3==null){
          this.x3 = evt.offsetX;
          this.y3 = evt.offsetY;
          console.log(this.x3,this.y3);
          this.screen.lineTo(this.x3,this.y3);
          this.screen.stroke();
        }else{
          if(this.x4==null){
            this.x4 = evt.offsetX;
            this.y4 = evt.offsetY;
            console.log(this.x4,this.y4);
            this.bili= [[this.x1+2,this.x2-2,this.x3-2,this.x4+2],
            [this.y1+2,this.y2+2,this.y3-2,this.y4-2]];
            console.log(this.bili);
            this.screen.lineTo(this.x4,this.y4);
            this.screen.stroke();
            this.screen.lineTo(this.x1,this.y1);
            this.screen.stroke();
            this.x1=this.x2=this.x3=this.x4=null;
          }
        }
      }
    }
    
  }
}