import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ComponentsModule } from './components.module'

@NgModule({
  imports: [CommonModule, RouterModule, ComponentsModule],
  exports: [CommonModule, RouterModule, ComponentsModule]
})
export class SharedModule {}
