import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementsXModule } from '../../../../lib/src';

@Component({
  template: `<h2>input</h2> <ee-input></ee-input>`,
  styles: [`<ee-input></ee-input>`]
})
export class InputComponent {}


@NgModule({
  declarations: [InputComponent],
  imports: [ ElementsXModule, FormsModule, CommonModule ]})
class DynModule {}