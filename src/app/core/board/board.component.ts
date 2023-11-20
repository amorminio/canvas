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

	public menuSelectedShape!: string

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
			this.drawCircle(event.offsetX, event.offsetY, event.offsetX + 30, event.offsetY + 30);
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
		console.log('1');
		
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
		}

		this._board.addShape(newShape)
		this._board.allShapes()
  }

	drawDragRectangle(x1: number, y1: number) {
		const width = SHAPES.rectangle.width;
		const height = SHAPES.rectangle.height;
		x1 = x1 - width / 2
		y1 = y1 - height / 2

		this.ctx.fillStyle = 'none'
		// this.ctx.fillRect(x1, y1, width, height);
		this.ctx.strokeRect(x1, y1, width, height);

		const newShape: Shape = {
			type: 'rectangle',

			startX: x1,
			startY: y1,
			height: height,
			width: width,
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
		}

		this._board.addShape(newShape)
		this._board.allShapes()
	}

	drawRectangle(x1: number, y1: number, x2: number, y2: number, redraw: boolean = false) {
		const width = x2
		const height = y2

		// this.ctx.fillRect(x1, y1 , width, height);
		this.ctx.strokeRect(x1, y1, width, height);

		if (!redraw) {
			const newShape: Shape = {
				type: 'rectangle',
				startX: x1,
				startY: y1,
				height: height,
				width: width,
			}

			this._board.addShape(newShape)
		}

	}

	drawRoundRectangle(x1: number, y1: number, x2: number, y2: number, redraw: boolean = false) {
		const width = x2
		const height = y2

		this.ctx.beginPath();
		this.ctx.roundRect(x1, y1, width, height, 10);
		this.ctx.stroke();

		if (!redraw) {
			const newShape: Shape = {
				type: 'round-rectangle',
				startX: x1,
				startY: y1,
				height: height,
				width: width,
			}

			this._board.addShape(newShape)
		}

	}

	drawDiamond(x1: number, y1: number, x2: number, y2: number, redraw: boolean = false) {

		const width = x2
		const height = y2

    this.ctx.beginPath();
    this.ctx.moveTo(x1-(width/2), y1);
    this.ctx.lineTo(x1, y1 +(height/2));
    this.ctx.lineTo(x1 + (width/2), y1);
    this.ctx.lineTo(x1,y1 - (height/2));
    this.ctx.closePath();
    this.ctx.stroke();

		if (!redraw) {
			const newShape: Shape = {
				type: 'diamond',
				startX: x1,
				startY: y1,
				height: height,
				width: width,
			}

			this._board.addShape(newShape)
			
		}

		this._board.allShapes()

	}

	drawCircle(x1: number, y1: number, x2: number, y2: number, redraw: boolean = false) {
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
			}

			this._board.addShape(newShape)
		}
	}

	repaint() {
		this.clearCanvas()

		const shapes = this._board.getShapes

		shapes.forEach((shape) => {
			this.ctx.fillStyle = shape.fillColor

			switch (shape.type) {
				case 'rectangle':
					this.drawRectangle(shape.startX, shape.startY, shape.width, shape.height, true);
					break
				case 'round-rectangle':
					this.drawRoundRectangle(shape.startX, shape.startY, shape.width, shape.height, true);
					break
				case 'circle':
					this.drawCircle(shape.startX, shape.startY, shape.width, shape.height, true);
					break
				case 'diamond':
					this.drawDiamond(shape.startX, shape.startY, shape.width, shape.height, true);
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


	// NOT USED =============================================================================
	// Initial development references
	drawFreeRectangle(x1: number, y1: number, x2: number, y2: number) {
		const width = x2 - x1;
		const height = y2 - y1;
		this.ctx.fillRect(x1, y1, width, height);
		this.ctx.strokeRect(x1, y1, width, height);
	}

	draw(event: MouseEvent) {
		this.endX = event.offsetX;
		this.endY = event.offsetY;
		this.drawFreeRectangle(this.startX, this.startY, this.endX, this.endY);
	}

	drawStart(event: MouseEvent) {
		this.startX = event.offsetX;
		this.startY = event.offsetY;
	}

	drawStop(event: MouseEvent) {
		if (!this.menuSelectedShape) { return }

		if (this.menuSelectedShape === 'rectangle') {
			this.drawFreeRectangle(this.startX, this.startY, event.offsetX, event.offsetY);
		}

		if (this.menuSelectedShape === 'circle') {
			this.drawCircle(this.startX, this.startY, event.offsetX, event.offsetY);
		}

		this.menuSelectedShape = ''
	}

}
