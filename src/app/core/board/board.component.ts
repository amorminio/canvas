import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BoardService } from 'src/app/_services/board.service';
import { SHAPES,COLORS } from 'src/app/_shared/constants';
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

	public menuSelectedShape!: string
	public boardSelectedShape!: Shape

	constructor(private _board: BoardService) {

	}

	ngOnInit() {
		this.ctx = this.canvas.nativeElement.getContext('2d');
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = 'black';
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';

		// Event Listeners =====================================================================

		this.canvas.nativeElement.addEventListener('dragover', (event: any) => {
			event.preventDefault();
		});

		this.canvas.nativeElement.addEventListener('drop', (event: any) => {
			event.preventDefault();
			const data = event.dataTransfer.getData('text');
			if (data === 'draggable-element') {
				const x = event.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
				const y = event.clientY - this.canvas.nativeElement.getBoundingClientRect().top;
				this.drawDragged(event)
			}
		});

		this.canvas.nativeElement.addEventListener('click', (event: MouseEvent) => {
			this._board.detectShapeOnCavas(event)
		});

		this._board.menuSelectedShape$.subscribe((data) => {
			this.menuSelectedShape = data
		})
		
		
		
		
		this._board.repaint$.subscribe((shape) => {
			this.repaint()

		})

	}

	ngAfterViewInit() {

		this.shapes.forEach((element: ElementRef) => {
			element.nativeElement.addEventListener('dragstart', (event: any) => {
				event.dataTransfer.setData('text', 'draggable-element');
			});

		});
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
	}

	drawDragged(event: MouseEvent) {

		if (!this.menuSelectedShape) { return }

		if (this.menuSelectedShape === 'rectangle') {
			this.drawDragRectangle(event.offsetX, event.offsetY);
		}

		else if (this.menuSelectedShape === 'circle') {
			this.drawDragCircle(event.offsetX, event.offsetY, event.offsetX + 30, event.offsetY + 30);
		}

		else if (this.menuSelectedShape === 'round-rectangle') {
			this.drawDragRoundRectangle(event.offsetX, event.offsetY);
		}

		else if (this.menuSelectedShape === 'diamond') {
			this.drawDragDiamond(event.offsetX, event.offsetY);
		}

		this._board.setMenuSelectedShape = ''

	}

	drawDragDiamond(x1: number, y1: number) {

		const width = SHAPES.diamond.width;
		const height = SHAPES.diamond.height;

    this.ctx.beginPath();
    this.ctx.moveTo(x1-(width/2), y1);
    this.ctx.lineTo(x1, y1 +(height/2));
    this.ctx.lineTo(x1 + (width/2), y1);
    this.ctx.lineTo(x1,y1 - (height/2));
    this.ctx.closePath();
    this.ctx.stroke();

		const newShape: Shape = {
			type: 'diamond',
			startX: x1,
			startY: y1,
			height: height,
			width: width,
			strokeStyle:COLORS.strokeColor.color
		}

		this._board.addShape(newShape)
		this._board.allShapes()
  }

	drawDragCircle(x1: number, y1: number, x2: number, y2: number, redraw: boolean = false) {
		// const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		const radius = 20

		this.ctx.beginPath();
		this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
		this.ctx.stroke();

		if (!redraw) {
			const newShape: Shape = {
				type: 'circle',
				startX: x1,
				startY: y1,
				height: y2,
				width: x2,
				strokeStyle:COLORS.strokeColor.color
			}

			this._board.addShape(newShape)
		}
	}

	drawDragRectangle(x1: number, y1: number) {
		const width = SHAPES.rectangle.width;
		const height = SHAPES.rectangle.height;
		x1 = x1 - width / 2
		y1 = y1 - height / 2

		this.ctx.fillStyle = 'none'
		this.ctx.strokeRect(x1, y1, width, height);

		const newShape: Shape = {
			type: 'rectangle',

			startX: x1,
			startY: y1,
			height: height,
			width: width,
			strokeStyle:COLORS.strokeColor.color
		}

		this._board.addShape(newShape)
		this._board.allShapes()
	}

	drawDragRoundRectangle(x1: number, y1: number) {
		const width = SHAPES.rectangle.width;
		const height = SHAPES.rectangle.height;
		x1 = x1 - width / 2
		y1 = y1 - height / 2

		this.ctx.beginPath();
		this.ctx.roundRect(x1, y1, width, height, 10);
		this.ctx.stroke();

		const newShape: Shape = {
			type: 'round-rectangle',

			startX: x1,
			startY: y1,
			height: height,
			width: width,
			strokeStyle:COLORS.strokeColor.color
		}

		this._board.addShape(newShape)
		this._board.allShapes()
	}

	drawCircle(shape:Shape, redraw: boolean = false) {
		// const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		const radius = 20

		this.ctx.beginPath();
		this.ctx.strokeStyle = shape.strokeStyle || COLORS.strokeColor.color
		this.ctx.arc(shape.startX, shape.startY, radius, 0, Math.PI * 2);
		this.ctx.stroke();

		if (!redraw) {
			const newShape: Shape = {
				type: 'circle',
				startX: shape.startX,
				startY: shape.startY,
				height: shape.height,
				width: shape.width,
				strokeStyle:shape.strokeStyle || COLORS.strokeStyle.color
			}

			this._board.addShape(newShape)
		}
	}

	drawRectangle(shape:Shape,redraw: boolean = false) {

		this.ctx.strokeStyle = shape.strokeStyle || COLORS.strokeStyle.color
		this.ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);

		if (!redraw) {
			const newShape: Shape = {
				type: 'rectangle',
				startX: shape.startX,
				startY: shape.startY,
				height: shape.height,
				width: shape.width,
				strokeStyle:shape.strokeStyle
			}

			this._board.addShape(newShape)
		}

	}

	drawRoundRectangle(shape:Shape, redraw: boolean = false) {

		this.ctx.beginPath();
		this.ctx.strokeStyle = shape.strokeStyle || COLORS.strokeColor.color
		this.ctx.roundRect(shape.startX, shape.startY, shape.width, shape.height, 10);
		this.ctx.stroke();

		if (!redraw) {
			const newShape: Shape = {
				type: 'round-rectangle',
				startX: shape.startX,
				startY: shape.startY,
				height: shape.height,
				width:shape.width,
				strokeStyle:COLORS.strokeColor.color
			}

			this._board.addShape(newShape)
		}

	}

	drawDiamond(shape:Shape, redraw: boolean = false) {

		this.ctx.beginPath();
		this.ctx.strokeStyle = shape.strokeStyle || COLORS.strokeColor.color
    this.ctx.moveTo(shape.startX-(shape.width/2), shape.startY);
    this.ctx.lineTo(shape.startX, shape.startY +(shape.height/2));
    this.ctx.lineTo(shape.startX + (shape.width/2), shape.startY);
    this.ctx.lineTo(shape.startX,shape.startY - (shape.height/2));
    this.ctx.closePath();
    this.ctx.stroke();

		if (!redraw) {
			const newShape: Shape = {
				type: 'diamond',
				startX: shape.startX,
				startY: shape.startY,
				height: shape.height,
				width: shape.width,
				strokeStyle:shape.strokeStyle || COLORS.strokeStyle.color
			}

			this._board.addShape(newShape)
			
		}

		this._board.allShapes()

	}

	

	repaint() {

		this.clearCanvas()

		const shapes = this._board.getShapes

		shapes.forEach((shape) => {
			switch (shape.type) {
				case 'rectangle':
					this.drawRectangle(shape, true);
					break
				case 'round-rectangle':
					this.drawRoundRectangle(shape, true);
					break
				case 'circle':
					this.drawCircle(shape, true);
					break
				case 'diamond':
					this.drawDiamond(shape, true);
					break
				default:
					console.info('Shape not found')
			}
		})

		this._board.allShapes()

	}

	selectShape(event: MouseEvent, shape: string) {
		event.stopPropagation();
		this._board.setMenuSelectedShape = shape
	}
	
}
