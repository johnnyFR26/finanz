import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../../services/category.service';
import { PlanningService } from '../../../../services/planning.service';
import { AccountService } from '../../../../services/account.service';

interface Category {
  id: string;
  name: string;
  limit: number;
  categoryId: string;
}

interface PlanningCategory {
  categoryId: string;
  limit: number;
  categoryName?: string;
}

interface CreatePlanningRequest {
  month: Date;
  day?: number;
  year: number;
  limit: number;
  availableLimit: number;
  title?: string;
  accountId: string;
  categories: PlanningCategory[];
  incomes?: Array<{ name: string; value: number }>;
  expenses?: Array<{
    name: string;
    totalValue: number;
    installments: number;
    currentInstallment: number;
    monthlyValue: number;
    startDate: string;
    type: string;
  }>;
}

@Component({
  selector: 'app-new-planning',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  styleUrls: ['./new-planning.component.scss'],
  template: `
    <div class="new-planning">
        <button class="back" mat-icon-button (click)="this.router.navigate(['/home/planning'])"><mat-icon>keyboard_backspace</mat-icon></button>
      <mat-card class="planning-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>event_note</mat-icon>
            Novo Planejamento
          </mat-card-title>
          <mat-card-subtitle>
            Crie seu planejamento mensal com categorias
          </mat-card-subtitle>
        </mat-card-header>
    
        <mat-card-content>
          <form [formGroup]="planningForm" (ngSubmit)="onSubmit()" class="planning-form">
    
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Informações Básicas
              </h3>
    
              <div class="form-row">
                <mat-form-field class="full-width">
                  <mat-label>Título do Planejamento</mat-label>
                  <input matInput formControlName="title" placeholder="Ex: Planejamento Janeiro 2025">
                  <mat-icon matSuffix>title</mat-icon>
                </mat-form-field>
              </div>
    
              <div class="form-row">
                <mat-form-field class="date-field">
                  <mat-label>Mês/Ano</mat-label>
                  <input matInput [matDatepicker]="monthPicker" formControlName="date" readonly>
                  <mat-datepicker-toggle matIconSuffix [for]="monthPicker"></mat-datepicker-toggle>
                  <mat-datepicker #monthPicker startView="multi-year"></mat-datepicker>
                </mat-form-field>
              </div>
            </div>
    
            <mat-divider></mat-divider>

            <!-- Fontes de Renda -->
            <div class="form-section">
              <div class="section-header">
                <h3 class="section-title">
                  <mat-icon>account_balance</mat-icon>
                  Fontes de Renda
                </h3>
                <button type="button" mat-raised-button color="primary" (click)="addIncome()">
                  <mat-icon>add</mat-icon>
                  Adicionar Renda
                </button>
              </div>

              <div formArrayName="incomes" class="incomes-list">
                @for (incomeControl of incomesArray.controls; track incomeControl; let i = $index) {
                  <div [formGroupName]="i" class="income-item">
                    <mat-card class="income-card">
                      <div class="income-form">
                        <mat-form-field class="income-name">
                          <mat-label>Nome</mat-label>
                          <input matInput formControlName="name" placeholder="Ex: Salário">
                        </mat-form-field>
                        <mat-form-field class="income-value">
                          <mat-label>Valor</mat-label>
                          <input matInput type="number" formControlName="value" placeholder="0.00">
                          <span matTextPrefix>R$&nbsp;</span>
                        </mat-form-field>
                        <button type="button" mat-icon-button color="warn" (click)="removeIncome(i)"
                          [attr.aria-label]="'Remover renda ' + i">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </mat-card>
                  </div>
                }

                @if (incomesArray.length === 0) {
                  <div class="no-items">
                    <mat-icon>account_balance</mat-icon>
                    <p>Nenhuma fonte de renda adicionada</p>
                    <p class="hint">Clique em "Adicionar Renda" para começar</p>
                  </div>
                }
              </div>
            </div>

            <mat-divider></mat-divider>
    
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>account_balance_wallet</mat-icon>
                Limites Financeiros
              </h3>
    
              <div class="form-row">
                <mat-form-field class="half-width">
                  <mat-label>Limite Total</mat-label>
                  <input matInput type="number" formControlName="total" placeholder="0.00">
                  <span matTextPrefix>R$ </span>
                  @if (planningForm.get('total')?.hasError('required')) {
                    <mat-error>
                      Limite total é obrigatório
                    </mat-error>
                  }
                  @if (planningForm.get('total')?.hasError('min')) {
                    <mat-error>
                      Deve ser maior que zero
                    </mat-error>
                  }
                </mat-form-field>
              </div>
    
              @if (totalLimit() > 0) {
                <div class="values-summary">
                  <div class="summary-item">
                    <span class="label">Limite Total:</span>
                    <span class="value total">R$ {{ totalLimit() | number:'1.2-2' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Disponível:</span>
                    <span class="value available">R$ {{ availableLimit() | number:'1.2-2' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Soma Categorias:</span>
                    <span class="value categories" [class.warning]="categoriesTotal() > totalLimit()">
                      R$ {{ categoriesTotal() | number:'1.2-2' }}
                    </span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Receitas:</span>
                    <span class="value available">R$ {{ totalIncome() | number:'1.2-2' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Despesas:</span>
                    <span class="value categories">R$ {{ totalExpenses() | number:'1.2-2' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Balanço:</span>
                    <span class="value" [class.available]="totalIncome() - totalExpenses() >= 0"
                      [class.warning]="totalIncome() - totalExpenses() < 0">
                      R$ {{ totalIncome() - totalExpenses() | number:'1.2-2' }}
                    </span>
                  </div>
                </div>
              }
            </div>
    
            <mat-divider></mat-divider>
    
            <div class="form-section">
              <div class="section-header">
                <h3 class="section-title">
                  <mat-icon>category</mat-icon>
                  Categorias do Planejamento
                </h3>
                <button type="button" mat-raised-button color="primary" (click)="addCategory()"
                  [disabled]="!hasAvailableCategories()">
                  <mat-icon>add</mat-icon>
                  Adicionar Categoria
                </button>
              </div>
    
              <div formArrayName="categories" class="categories-list">
                @for (categoryControl of categoriesArray.controls; track categoryControl; let i = $index) {
                  <div
                    [formGroupName]="i" class="category-item">
                    <mat-card class="category-card">
                      <div class="category-form">
                        <mat-form-field class="category-select">
                          <mat-label>Categoria</mat-label>
                          <mat-select formControlName="categoryId" (selectionChange)="onCategoryChange(i)">
                            @for (category of availableCategories(); track category) {
                              <mat-option [value]="category.id">
                                {{ category.name }}
                              </mat-option>
                            }
                          </mat-select>
                          @if (getCategoryControl(i, 'categoryId')?.hasError('required')) {
                            <mat-error>
                              Selecione uma categoria
                            </mat-error>
                          }
                        </mat-form-field>
                        <mat-form-field class="limit-input">
                          <mat-label>Limite</mat-label>
                          <input matInput type="number" formControlName="limit" placeholder="0.00">
                          <span matTextPrefix>R$ </span>
                          @if (getCategoryControl(i, 'limit')?.hasError('required')) {
                            <mat-error>
                              Limite é obrigatório
                            </mat-error>
                          }
                          @if (getCategoryControl(i, 'limit')?.hasError('min')) {
                            <mat-error>
                              Deve ser maior que zero
                            </mat-error>
                          }
                        </mat-form-field>
                        <button type="button" mat-icon-button color="warn" (click)="removeCategory(i)"
                          [attr.aria-label]="'Remover categoria ' + i">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                      @if (getCategoryName(i)) {
                        <div class="category-info">
                          <span class="category-name">{{ getCategoryName(i) }}</span>
                          @if (getCategoryLimit(i) > 0 && totalLimit() > 0) {
                            <span class="category-percentage">
                              {{ (getCategoryLimit(i) / totalLimit() * 100) | number:'1.1-1' }}% do total
                            </span>
                          }
                        </div>
                      }
                    </mat-card>
                  </div>
                }
    
                @if (categoriesArray.length === 0) {
                  <div class="no-categories">
                    <mat-icon>category</mat-icon>
                    <p>Nenhuma categoria adicionada</p>
                    <p class="hint">Clique em "Adicionar Categoria" para começar</p>
                  </div>
                }
              </div>
    
              @if (showValidationMessages()) {
                <div class="validation-messages">
                  @if (categoriesTotal() > totalLimit()) {
                    <div class="error-message">
                      <mat-icon>warning</mat-icon>
                      A soma dos limites das categorias (R$ {{ categoriesTotal() | number:'1.2-2' }})
                      excede o limite total (R$ {{ totalLimit() | number:'1.2-2' }})
                    </div>
                  }
                </div>
              }
            </div>
    
            <mat-divider></mat-divider>

            <!-- Despesas -->
            <div class="form-section">
              <div class="section-header">
                <h3 class="section-title">
                  <mat-icon>receipt_long</mat-icon>
                  Despesas
                </h3>
                <button type="button" mat-raised-button color="primary" (click)="addExpense()">
                  <mat-icon>add</mat-icon>
                  Adicionar Despesa
                </button>
              </div>

              <div formArrayName="expenses" class="expenses-list">
                @for (expenseControl of expensesArray.controls; track expenseControl; let i = $index) {
                  <div [formGroupName]="i" class="expense-item">
                    <mat-card class="expense-card">
                      <div class="expense-form">
                        <mat-form-field class="expense-name">
                          <mat-label>Nome</mat-label>
                          <input matInput formControlName="name" placeholder="Ex: Aluguel">
                        </mat-form-field>
                        <mat-form-field class="expense-type">
                          <mat-label>Tipo</mat-label>
                          <mat-select formControlName="type">
                            <mat-option value="fixed">Fixa</mat-option>
                            <mat-option value="installment">Parcelada</mat-option>
                            <mat-option value="variable">Variável</mat-option>
                          </mat-select>
                        </mat-form-field>
                        <mat-form-field class="expense-value">
                          <mat-label>Valor Total</mat-label>
                          <input matInput type="number" formControlName="totalValue" placeholder="0.00">
                          <span matTextPrefix>R$&nbsp;</span>
                        </mat-form-field>
                        @if (getExpenseControl(i, 'type')?.value === 'installment') {
                          <mat-form-field class="expense-installments">
                            <mat-label>Parcelas</mat-label>
                            <input matInput type="number" formControlName="installments" placeholder="2">
                          </mat-form-field>
                          <mat-form-field class="expense-current">
                            <mat-label>Parcela Atual</mat-label>
                            <input matInput type="number" formControlName="currentInstallment" placeholder="1">
                          </mat-form-field>
                        }
                        <mat-form-field class="expense-date">
                          <mat-label>Data Início</mat-label>
                          <input matInput [matDatepicker]="expDatePicker" formControlName="startDate" readonly>
                          <mat-datepicker-toggle matIconSuffix [for]="expDatePicker"></mat-datepicker-toggle>
                          <mat-datepicker #expDatePicker></mat-datepicker>
                        </mat-form-field>
                        <button type="button" mat-icon-button color="warn" (click)="removeExpense(i)"
                          [attr.aria-label]="'Remover despesa ' + i">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </mat-card>
                  </div>
                }

                @if (expensesArray.length === 0) {
                  <div class="no-items">
                    <mat-icon>receipt_long</mat-icon>
                    <p>Nenhuma despesa adicionada</p>
                    <p class="hint">Clique em "Adicionar Despesa" para começar</p>
                  </div>
                }
              </div>
            </div>

            <mat-divider></mat-divider>
    
            <div class="form-actions">
              <button type="button" mat-stroked-button (click)="onCancel()">
                <mat-icon>cancel</mat-icon>
                Cancelar
              </button>
    
              <button type="submit" mat-raised-button color="primary"
                [disabled]="isSubmitting()">
                @if (!isSubmitting()) {
                  <mat-icon>save</mat-icon>
                }
                @if (isSubmitting()) {
                  <mat-icon class="spinner">refresh</mat-icon>
                }
                {{ isSubmitting() ? 'Criando...' : 'Criar Planejamento' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    `
})
export class NewPlanningComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  protected router = inject(Router);
  private categoryService = inject(CategoryService)
  private planningService = inject(PlanningService)
  private accountService = inject(AccountService)
  private account = this.accountService.getCurrentAccount()

  isSubmitting = signal(false);
  availableCategoriesData = this.categoryService.getCurrentCategories();

  planningForm: FormGroup;

  constructor() {
    this.planningForm = this.createForm();
  }

  totalLimit = computed(() => this.planningForm?.get('total')?.value || 0);
  availableLimit = computed(() => this.planningForm?.get('available')?.value || 0);
  
  categoriesTotal = computed(() => {
    return this.categoriesArray.controls.reduce((total, control) => {
      const limit = control.get('limit')?.value || 0;
      return total + Number(limit);
    }, 0);
  });

  totalIncome = computed(() => {
    return this.incomesArray.controls.reduce((total, control) => {
      const value = control.get('value')?.value || 0;
      return total + Number(value);
    }, 0);
  });

  totalExpenses = computed(() => {
    return this.expensesArray.controls.reduce((total, control) => {
      const type = control.get('type')?.value;
      const totalValue = Number(control.get('totalValue')?.value) || 0;
      const installments = Number(control.get('installments')?.value) || 1;
      const monthlyValue = type === 'installment' ? totalValue / installments : totalValue;
      return total + monthlyValue;
    }, 0);
  });

  availableCategories = computed(() => {
    const selectedIds = this.categoriesArray.controls
      .map(control => control.get('categoryId')?.value)
      .filter(id => id);
    
    return this.availableCategoriesData().filter(cat => !selectedIds.includes(cat.id));
  });

  get categoriesArray(): FormArray {
    return this.planningForm.get('categories') as FormArray;
  }

  get incomesArray(): FormArray {
    return this.planningForm.get('incomes') as FormArray;
  }

  get expensesArray(): FormArray {
    return this.planningForm.get('expenses') as FormArray;
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: [''],
      date: [new Date(), Validators.required],
      total: [0, [Validators.required, Validators.min(0.01)]],
      available: [0, [Validators.required, Validators.min(0.01)]],
      categories: this.fb.array([]),
      incomes: this.fb.array([]),
      expenses: this.fb.array([])
    });
  }

  private createCategoryForm(): FormGroup {
    return this.fb.group({
      categoryId: ['', Validators.required],
      limit: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  private createIncomeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  private createExpenseForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['fixed', Validators.required],
      totalValue: [0, [Validators.required, Validators.min(0.01)]],
      installments: [2, [Validators.required, Validators.min(2)]],
      currentInstallment: [1, [Validators.required, Validators.min(1)]],
      startDate: [new Date(), Validators.required]
    });
  }

  addCategory(): void {
    if (this.hasAvailableCategories()) {
      this.categoriesArray.push(this.createCategoryForm());
    }
  }

  removeCategory(index: number): void {
    this.categoriesArray.removeAt(index);
  }

  addIncome(): void {
    this.incomesArray.push(this.createIncomeForm());
  }

  removeIncome(index: number): void {
    this.incomesArray.removeAt(index);
  }

  addExpense(): void {
    this.expensesArray.push(this.createExpenseForm());
  }

  removeExpense(index: number): void {
    this.expensesArray.removeAt(index);
  }

  onCategoryChange(index: number): void {
    const categoryId = this.getCategoryControl(index, 'categoryId')?.value;
    const category = this.availableCategoriesData().find(cat => cat.id === categoryId);
    
    if (category) {
      this.getCategoryControl(index, 'categoryName')?.setValue(category.name);
    }
  }

  getCategoryControl(index: number, controlName: string) {
    return this.categoriesArray.at(index)?.get(controlName);
  }

  getExpenseControl(index: number, controlName: string) {
    return this.expensesArray.at(index)?.get(controlName);
  }

  getCategoryName(index: number): string {
    const categoryId = this.getCategoryControl(index, 'categoryId')?.value;
    const category = this.availableCategoriesData().find(cat => cat.id === categoryId);
    return category?.name || '';
  }

  getCategoryLimit(index: number): number {
    return this.getCategoryControl(index, 'limit')?.value || 0;
  }

  hasAvailableCategories(): boolean {
    return this.availableCategories().length > 0;
  }

  showValidationMessages(): boolean {
    return this.categoriesArray.length > 0 && this.totalLimit() > 0;
  }

  async onSubmit(): Promise<void> {
    console.log('onSubmit() called', this.planningForm.value, this.planningForm.valid);
      this.isSubmitting.set(true);
      
      try {
        const formValue = this.planningForm.value;
        const selectedDate = new Date(formValue.date);
        
        const request: CreatePlanningRequest = {
          month: new Date(selectedDate),
          day: selectedDate.getDate(),
          year: selectedDate.getFullYear(),
          limit: Number(formValue.total),
          availableLimit: Number(formValue.total),
          title: formValue.title || undefined,
          accountId: this.account()?.id || '',
          categories: formValue.categories.map((cat: Category) => ({
            categoryId: cat.categoryId,
            limit: Number(cat.limit)
          })),
          incomes: formValue.incomes.map((inc: any) => ({
            name: inc.name,
            value: Number(inc.value)
          })),
          expenses: formValue.expenses.map((exp: any) => {
            const type = exp.type;
            const totalValue = Number(exp.totalValue);
            const installments = type === 'installment' ? Number(exp.installments) : 1;
            const currentInstallment = type === 'installment' ? Number(exp.currentInstallment) : 1;
            const monthlyValue = type === 'installment' ? totalValue / installments : totalValue;
            const startDate = exp.startDate instanceof Date ? exp.startDate.toISOString() : new Date(exp.startDate).toISOString();
            return {
              name: exp.name,
              totalValue,
              installments,
              currentInstallment,
              monthlyValue,
              startDate,
              type
            };
          })
        };

        console.log('Criando planejamento:', request);
        
        this.planningService.createPlanning(request);
        
        this.snackBar.open('Planejamento criado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        this.router.navigate(['/home/planning']);
        
      } catch (error) {
        console.error('Erro ao criar planejamento:', error);
        this.snackBar.open('Erro ao criar planejamento. Tente novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } finally {
        this.isSubmitting.set(false);
      }
  }

  onCancel(): void {
    this.router.navigate(['/planning']);
  }

  

  private markFormGroupTouched(): void {
    Object.keys(this.planningForm.controls).forEach(key => {
      const control = this.planningForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach(nestedKey => {
              group.get(nestedKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }
}
