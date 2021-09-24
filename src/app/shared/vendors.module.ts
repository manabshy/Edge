import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgPipesModule } from "ngx-pipes";

// bootstrap
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { BsDropdownModule } from "ngx-bootstrap/dropdown/";
import { CollapseModule } from "ngx-bootstrap/collapse/";
import { TabsModule } from "ngx-bootstrap/tabs/";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ModalModule } from "ngx-bootstrap/modal/";
import { PopoverModule } from "ngx-bootstrap/popover";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { CarouselModule } from "ngx-bootstrap/carousel";

// vendor
import { OrderModule } from "ngx-order-pipe";
import { ToastrModule, ToastContainerModule } from "ngx-toastr";
import { AgmCoreModule } from "@agm/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { AngularStickyThingsModule } from "@w11k/angular-sticky-things";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxFileDropModule } from "ngx-file-drop";

//Primeng
import { SidebarModule } from "primeng/sidebar";
import { GalleriaModule } from "primeng/galleria";
import { DialogModule } from "primeng/dialog";
import { AccordionModule } from "primeng/accordion";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule } from "primeng/button";
import { EditorModule } from "primeng/editor";
import { PanelModule } from "primeng/panel";
import { ChartModule } from "primeng/chart";
import { TabViewModule } from "primeng/tabview";
import { ChipModule } from "primeng/chip";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import { TooltipModule } from "primeng/tooltip";
import { BadgeModule } from "primeng/badge";
import { CardModule } from "primeng/card";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { TableModule } from "primeng/table";
import { MenuModule } from "primeng/menu";
import { CheckboxModule } from "primeng/checkbox";
import { FileUploadModule } from "@iplab/ngx-file-upload";

const externalModules = [
  ReactiveFormsModule, 
  FormsModule,
  InfiniteScrollModule,
  CollapseModule,
  TabsModule,
  TypeaheadModule,
  BsDropdownModule,
  BsDatepickerModule,
  ModalModule,
  PopoverModule,
  NgPipesModule,
  TooltipModule,
  ButtonsModule,
  ButtonModule,
  BadgeModule,
  OrderModule,
  ToastrModule,
  ToastContainerModule,
  AgmCoreModule,
  CarouselModule,
  NgbModule,
  LoadingBarHttpClientModule,
  AngularStickyThingsModule,
  NgSelectModule,
  NgxFileDropModule,
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
  CheckboxModule,
  FileUploadModule,
];

@NgModule({
  imports: [externalModules],
  exports: [externalModules],
})
export class VendorsModule {}
