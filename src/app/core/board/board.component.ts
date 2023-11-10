import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BoardService } from 'src/app/_services/board.service';
import { SHAPES } from 'src/app/_shared/constants';
import { Shape } from '../../_shared/shape.interface';



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
	
	@ViewChild('canvas', { static: true }) canvas!: ElementRef;
	@ViewChildren('shapes') shapes!: QueryList<ElementRef>;

  private ctx!: CanvasRenderingContext2D;

	
  private startX!: number;
  private startY!: number;
  private endX!: number;
  private endY!: number;

	constructor(private _board:BoardService){
		
	}

	ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

		this.canvas.nativeElement.addEventListener('dragover', (event:any) => {
      event.preventDefault();
    });

		this.canvas.nativeElement.addEventListener('drop', (event:any) => {
      event.preventDefault();
      const data = event.dataTransfer.getData('text');
      if (data === 'draggable-element') {
        const x = event.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
        const y = event.clientY - this.canvas.nativeElement.getBoundingClientRect().top;
				this.drawDragged(event)
      }
    });

  }

	ngAfterViewInit() {
		this.shapes.forEach((element: ElementRef) => {
		
			element.nativeElement.addEventListener('dragstart', (event:any) => {
				console.log('teste');
				
				event.dataTransfer.setData('text', 'draggable-element');
			});
			
		});
	}
	

	draw(event: MouseEvent) {

	  this.endX = event.offsetX;
    this.endY = event.offsetY;
    this.drawFreeRectangle(this.startX, this.startY, this.endX, this.endY);

  }

	clearCanvas(){
		this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
	}

	drawStart(event: MouseEvent) {
		
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }

	drawStop(event: MouseEvent) {
		if(!this.selectedShape) {return}

		if(this.selectedShape === 'rectangle'){
			this.drawFreeRectangle(this.startX, this.startY, event.offsetX, event.offsetY);    
		}

		if(this.selectedShape === 'circle'){
			this.drawCircle(this.startX, this.startY, event.offsetX, event.offsetY);    
		}

		this.selectedShape = ''
	}

	drawDragged(event: MouseEvent){
		
		if(!this.selectedShape) {return}

		if(this.selectedShape === 'rectangle'){
			// this.drawRectangle(event.offsetX, event.offsetY, event.offsetX+150, event.offsetY+100);    
			this.drawRectangle(event.offsetX, event.offsetY);
		}

		if(this.selectedShape === 'circle'){
			this.drawCircle(event.offsetX, event.offsetY, event.offsetX+30, event.offsetY+30);    
		}

		this.selectedShape = ''

	}

	drawRectangle(x1: number, y1: number) {
    const width = SHAPES.rectangle.width ;
    const height = SHAPES.rectangle.height;

    this.ctx.fillStyle = '#4682B4'
    this.ctx.fillRect(x1 - width/2, y1 - height/2, width, height);
    this.ctx.strokeRect(x1 - width/2, y1 - height/2, width, height);

		const newShape:Shape = {
			type:'rectangle',
			fillColor :'#4682B4',
			startX:x1,
			startY:y1,
			endY:height,
			endX:width,
		}

		this._board.addShape(newShape)
		this._board.allShapes()
  }

	drawFreeRectangle(x1: number, y1: number, x2: number, y2: number) {
    const width = x2 - x1;
    const height = y2 - y1;

    this.ctx.fillStyle = '#4682B4'
    this.ctx.fillRect(x1, y1, width, height);
    this.ctx.strokeRect(x1, y1, width, height);
  }

	drawCircle(x1: number, y1: number, x2: number, y2: number) {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    this.ctx.fillStyle = '#4682B4'; 
    this.ctx.beginPath();
    this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

		const newShape:Shape = {
			type:'circle',
			fillColor :'#4682B4',
			startX:x1,
			startY:y1,
			endY:y2,
			endX:x2,
		}

		this._board.addShape(newShape)
  }

	repaint(){
		const shapes = this._board.shapesArray
		
		shapes.forEach(function(x){
			switch (x.type){
				case 'rectangle':
					// this.drawRectangle(x.startX, x.startY);

			}
			// this.drawCircle(event.offsetX, event.offsetY, event.offsetX+30, event.offsetY+30);    
			
		})

	}

	selectShape(event:MouseEvent,shape:string){
		
		event.stopPropagation();
		this.selectedShape = shape
	}

}
