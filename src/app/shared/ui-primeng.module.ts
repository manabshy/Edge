import { NgModule } from '@angular/core'

//Primeng
import { SidebarModule } from 'primeng/sidebar'
import { GalleriaModule } from 'primeng/galleria'
import { DialogModule } from 'primeng/dialog'
import { AccordionModule } from 'primeng/accordion'
import { DynamicDialogModule } from 'primeng/dynamicdialog'
import { ToastModule } from 'primeng/toast'
import { DropdownModule } from 'primeng/dropdown'
import { MultiSelectModule } from 'primeng/multiselect'
import { ButtonModule } from 'primeng/button'
import { EditorModule } from 'primeng/editor'
import { PanelModule } from 'primeng/panel'
import { ChartModule } from 'primeng/chart'
import { TabViewModule } from 'primeng/tabview'
import { ChipModule } from 'primeng/chip'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { ChipsModule } from 'primeng/chips'
import { TooltipModule } from 'primeng/tooltip'
import { BadgeModule } from 'primeng/badge'
import { CardModule } from 'primeng/card'
import { MessagesModule } from 'primeng/messages'
import { MessageModule } from 'primeng/message'
import { ScrollPanelModule } from 'primeng/scrollpanel'
import { TableModule } from 'primeng/table'
import { MenuModule } from 'primeng/menu'
import { CheckboxModule } from 'primeng/checkbox'

const modules = [
  TooltipModule,
  ButtonModule,
  BadgeModule,
  GalleriaModule,
  DialogModule,
  AccordionModule,
  DynamicDialogModule,
  ToastModule,
  DropdownModule,
  MultiSelectModule,
  EditorModule,
  TabViewModule,
  ChipModule,
  AutoCompleteModule,
  ChipsModule,
  PanelModule,
  ChartModule,
  SidebarModule,
  CardModule,
  MessageModule,
  MessagesModule,
  ScrollPanelModule,
  TableModule,
  MenuModule,
  CheckboxModule
]

@NgModule({
  imports: modules,
  exports: modules
})
export class PrimeNGModule {}
