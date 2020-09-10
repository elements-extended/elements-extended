import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementsXModule } from '../../../../lib/src';

@Component({
  template: `<h2>prism</h2>`,
  styles: [`<pre ee-prism></pre>`]
})
export class MenuComponent {}

@NgModule({
  declarations: [MenuComponent],
  imports: [ ElementsXModule, FormsModule, CommonModule ]})
class DynModule {}