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
		else if (shape.type === 'round-rectangle') {
			return(	x >= shape.startX && x <= shape.startX + shape.width && y >= shape.startY && y <= shape.startY + shape.height	)
		}
		else if (shape.type === 'diamond') {

			// console.log ('centerX :' , shape.startX)
			// console.log ('centerY :' , shape.startY)
			// console.log ('width :' , shape.width)
			// console.log ('height :' , shape.height)

			// Vertex Coordinates 
			const vertexA = {x:shape.startX-shape.width/2,y:shape.startY}
			const vertexB = {x:shape.startX,y:shape.startY+shape.height/2}
			const vertexC = {x:shape.startX+shape.width/2,y:shape.startY}
			const vertexD = {x:shape.startX,y:shape.startY-shape.height/2}

			// console.log ('va :' , vertexA)
			// console.log ('vb :' , vertexB)
			// console.log ('vc :' , vertexC)
			// console.log ('vd :' , vertexD)

			const diagonal= Math.sqrt( (Math.pow((vertexC.x - vertexA.x),2)) + Math.pow((vertexC.y - vertexA.y),2) )

			// Distances from canvas event
			const distance1 = Math.sqrt( (Math.pow((x - vertexA.x),2)) + Math.pow((y - vertexA.y),2) )
			const distance2 = Math.sqrt( (Math.pow((x - vertexB.x),2)) + Math.pow((y - vertexB.y),2) )
			const distance3 = Math.sqrt( (Math.pow((x - vertexC.x),2)) + Math.pow((y - vertexC.y),2) )
			const distance4 = Math.sqrt( (Math.pow((x - vertexD.x),2)) + Math.pow((y - vertexD.y),2) )

			return distance1 < diagonal /2|| distance2 < diagonal/2 || distance3 < diagonal/2 || distance4 < diagonal/2

			
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
