import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HeaderComponent } from './header/header.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
  declarations: [
    BoardComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
		MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule,MatIconModule,MatToolbarModule

  ],
	exports:[
		BoardComponent,
		HeaderComponent
	]
})
export class CoreModule { }
