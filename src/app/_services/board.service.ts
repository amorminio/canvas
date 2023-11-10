import { Injectable } from '@angular/core';
import { Shape } from '../_shared/shape.interface';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

	private shapes:Array<Shape> = []
	private boardSelectedShape = new BehaviorSubject<any>('');
	public boardSelectedShape$ = this.boardSelectedShape.asObservable();

	private menuSelectedShape = new BehaviorSubject<any>('');
	public menuSelectedShape$ = this.menuSelectedShape.asObservable();

  constructor() { }

	addShape(shape:Shape):void{
		this.shapes.push(shape)
	}

	allShapes():void{
		console.log(this.shapes);
	}


	get getShapes():Array<any>{
		return this.shapes		
	}
}
