import { Injectable } from '@angular/core';
import { Shape } from '../_shared/shape.interface';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

	private shapes:Array<Shape> = []
	private idCounter:number = 1
	private boardSelectedShape = new BehaviorSubject<any>('');
	public boardSelectedShape$ = this.boardSelectedShape.asObservable();

	private menuSelectedShape = new BehaviorSubject<any>('');
	public menuSelectedShape$ = this.menuSelectedShape.asObservable();

  constructor() { }

	addShape(shape:Shape):void{
		shape.id = this.idCounter
		this.idCounter += 1		
		this.shapes.push(shape)
	}

	allShapes():void{
		console.info(this.shapes);
	}

	detectShapeOnCavas(event:MouseEvent){
		const clickX = event.offsetX;
		const clickY = event.offsetY;
		
		// Iterate through shapes to check for selection
		for (let i = this.shapes.length - 1; i >= 0; i--) {
			const shape = this.shapes[i];
	
			if (this.isPointInShape(clickX, clickY, shape)) {
				// Handle the selected shape
				console.info('Selected shape:', shape);
				break; 
			}
		}
	}

	isPointInShape(x:number, y:number, shape:Shape) {
		if (shape.type === 'circle') {
			const distance = Math.sqrt((x - shape.startX) ** 2 + (y - shape.startY) ** 2);
			const radius = Math.sqrt(Math.pow(shape.width - shape.startX, 2) + Math.pow(shape.height - shape.startY, 2));
			return distance <= radius;
		}
		
		else if (shape.type === 'rectangle') {
			return(	x >= shape.startX && x <= shape.startX + shape.width && y >= shape.startY && y <= shape.startY + shape.height	)
		}

		return false;
	}

	get getShapes():Array<any>{
		return this.shapes		
	}
	
	set setMenuSelectedShape(selectedShape:string){
		 this.menuSelectedShape.next(selectedShape)
	}
}
