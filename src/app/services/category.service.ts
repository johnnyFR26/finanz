import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";
import { CategoryModel } from "../models/category.model";
import { CreateCategoryModel } from "../models/create-category.model";

@Injectable({
    providedIn: 'root'
})
export class CategoryService{
    private urlApi = environment.urlApi;
    private http = inject(HttpClient);
    private categories = signal<CategoryModel[]>([])
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()

    constructor(){
        effect(() => {
            this.getCategories()
        })
    }

    setCategories(categories: CategoryModel[]){
        this.categories.set(this.categories().concat(categories))
    }

    getCurrentCategories(){
        return this.categories.asReadonly()
    }


    createCategory(category: CreateCategoryModel){
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

    getCategories(){
        return this.http.get(`${this.urlApi}/category/${this.account()?.id}`).subscribe((response: any) => {
            this.setCategories(response)
        });
    }
}