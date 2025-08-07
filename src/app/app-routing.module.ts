import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VegetablesGridComponent } from "./component/vegetables-grid/vegetables-grid.component";
import { FruitsGridComponent } from "./component/fruits-grid/fruits-grid.component";
import { MainPageComponent } from "./component/main-page/main-page.component"; // ייבוא הרכיב החדש
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { AboutComponent } from "./component/about/about.component";
import { AddProductComponent } from "./component/add-product/add-product.component";

export const routes: Routes = [
  { path: "", component: MainPageComponent, pathMatch: "full" },
  { path: "form", component: AddProductComponent },
  { path: 'about', component:AboutComponent   },
  { path: 'add-product', component: AddProductComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}