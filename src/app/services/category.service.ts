import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";
import { CategoryModel } from "../models/category.model";

@Injectable({
    providedIn: 'root'
})
export class CategoryService{
    private urlApi = environment.urlApi;
    private http = inject(HttpClient);
    private categories = signal<CategoryModel[]>([])

    setCategories(categories: CategoryModel[]){
        this.categories.set(this.categories().concat(categories))
        console.table(this.categories())
    }

    getCurrentCategories(){
        return this.categories.asReadonly()
    }


    createCategory(category: CategoryModel){
        return this.http.post(`${this.urlApi}/category`, category)
        .subscribe({
            next: (response: any) => {
                console.log('Response:', response)
                this.setCategories([response])
            },
            error: (error: any) => {
                console.error('Error:', error)
            }
        })
    }
}