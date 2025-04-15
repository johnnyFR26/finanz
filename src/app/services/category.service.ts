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
    private accountService = inject(AccountService)
    private categories = signal<CategoryModel[]>([])

    getCategories(){
        this.http.get(`${this.urlApi}/category`)
    }

    createCategory(category: CategoryModel){
        return this.http.post(`${this.urlApi}/category`, category)
        .subscribe({
            next: (response: any) => {
                console.log('Response:', response)
            },
            error: (error: any) => {
                console.error('Error:', error)
            }
        })
    }
}