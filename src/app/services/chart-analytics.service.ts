import { computed, inject, Injectable } from '@angular/core';
import { TransactionService } from './transaction.service';
import { CategoryService } from './category.service';
import { CreditCardService } from './credit-card.service';
import { PlanningService } from './planning.service';
import { ThemeService } from './themeService';
import { topNWithOthers, groupTransactionsByMonth } from '../utils/chart-config';

@Injectable({
  providedIn: 'root',
})
export class ChartAnalyticsService {
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private creditCardService = inject(CreditCardService);
  private planningService = inject(PlanningService);
  private themeService = inject(ThemeService);

  readonly isDark = computed(() => this.themeService.getDarkTheme());

  readonly incomeTotal = this.transactionService.sum;

  readonly expenseTotal = this.transactionService.sub;

  readonly savingsRate = computed(() => {
    const income = this.incomeTotal();
    const expense = this.expenseTotal();
    return income > 0 ? ((income - expense) / income) * 100 : 0;
  });

  readonly expensesByCategory = computed(() => {
    const categories = this.categoryService.getCurrentCategories()();
    const items = categories
      .map(category => ({
        name: category.name,
        value: (category.transactions ?? [])
          .filter(t => t.type === 'output')
          .reduce((sum, t) => sum + parseFloat(t.value), 0),
      }))
      .filter(item => item.value > 0);
    return topNWithOthers(items, 7);
  });

  readonly incomeByCategory = computed(() => {
    const categories = this.categoryService.getCurrentCategories()();
    const items = categories
      .map(category => ({
        name: category.name,
        value: (category.transactions ?? [])
          .filter(t => t.type === 'input')
          .reduce((sum, t) => sum + parseFloat(t.value), 0),
      }))
      .filter(item => item.value > 0);
    return topNWithOthers(items, 7);
  });

  readonly spendingTrends = computed(() => {
    const categories = this.categoryService.getCurrentCategories()();
    const allTransactions = categories.flatMap(c => c.transactions ?? []);
    const grouped = groupTransactionsByMonth(allTransactions);
    const entries = Array.from(grouped.values());
    return entries.slice(-6);
  });

  readonly creditCardUsage = computed(() => {
    const cards = this.creditCardService.getCurrentCreditCard()();
    return cards.map(card => ({
      name: card.name,
      limit: card.limit,
      available: card.availableLimit,
      usagePercent: card.limit > 0
        ? ((card.limit - card.availableLimit) / card.limit) * 100
        : 0,
    }));
  });

  readonly budgetUtilization = computed(() => {
    const plannings = this.planningService.getPlanningsSignal()();
    const allCategories = plannings.flatMap(p => p.planningCategories ?? []);
    return allCategories.map((pc: any) => ({
      categoryName: pc.categoryName ?? 'Sem nome',
      planned: pc.limit ?? 0,
      actual: (pc.limit ?? 0) - (pc.availableLimit ?? 0),
      percent: pc.limit > 0
        ? (((pc.limit - (pc.availableLimit ?? 0)) / pc.limit) * 100)
        : 0,
    }));
  });

  readonly hasTransactionData = computed(() => {
    const categories = this.categoryService.getCurrentCategories()();
    return categories.some(c => (c.transactions?.length ?? 0) > 0);
  });

  readonly hasPlanningData = computed(() => {
    return this.planningService.getPlanningsSignal()().length > 0;
  });

  readonly hasCreditCardData = computed(() => {
    return this.creditCardService.getCurrentCreditCard()().length > 0;
  });

  readonly insights = computed(() => {
    const messages: string[] = [];
    const rate = this.savingsRate();

    if (rate > 15) {
      messages.push(`Parabéns! Você economizou ${rate.toFixed(1)}% este mês 🎉`);
    } else if (rate > 0) {
      messages.push(`Você está economizando ${rate.toFixed(1)}% da sua renda`);
    } else {
      messages.push('Atenção: seus gastos superaram suas receitas este mês');
    }

    const cards = this.creditCardUsage();
    for (const card of cards) {
      if (card.usagePercent > 80) {
        messages.push(`⚠️ ${card.name}: ${card.usagePercent.toFixed(0)}% do limite utilizado`);
      }
    }

    const budgets = this.budgetUtilization();
    for (const budget of budgets) {
      if (budget.percent > 90) {
        messages.push(`⚠️ ${budget.categoryName}: ${budget.percent.toFixed(0)}% do orçamento utilizado`);
      }
    }

    return messages;
  });
}
