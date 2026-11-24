import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartAnalyticsService } from '../../services/chart-analytics.service';
import { ThemeService } from '../../services/themeService';
import { createBaseChartOptions, getChartColors } from '../../utils/chart-config';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
  imports: [BaseChartDirective, MatIconModule],
})
export class GraphsComponent {
  private analyticsService = inject(ChartAnalyticsService);
  private themeService = inject(ThemeService);

  protected loading = signal(true);

  protected isDark = computed(() => this.themeService.getDarkTheme());

  protected chartOptions = computed(() => createBaseChartOptions(this.isDark()));

  protected barChartOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark);
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const fontColor = isDark ? '#f0f8ff' : '#181824';
    const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    return {
      ...base,
      scales: {
        x: {
          ticks: { color: fontColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: fontColor,
            callback: (value) => brlFormatter.format(Number(value)),
          },
          grid: { color: gridColor },
        },
      },
    } as ChartOptions<'bar'>;
  });

  protected budgetChartOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark);
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const fontColor = isDark ? '#f0f8ff' : '#181824';
    const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    return {
      ...base,
      indexAxis: 'y',
      scales: {
        x: {
          ticks: {
            color: fontColor,
            callback: (value) => brlFormatter.format(Number(value)),
          },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: fontColor },
          grid: { color: gridColor },
        },
      },
    } as ChartOptions<'bar'>;
  });

  protected creditCardChartOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark);
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const fontColor = isDark ? '#f0f8ff' : '#181824';

    return {
      ...base,
      plugins: {
        ...base.plugins,
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = typeof context.raw === 'number' ? context.raw : 0;
              return `${label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: fontColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: fontColor,
            callback: (value: any) => `${value}%`,
          },
          grid: { color: gridColor },
        },
      },
    } as ChartOptions<'bar'>;
  });

  protected incomeExpenseChartData = computed<ChartData<'doughnut'>>(() => {
    const isDark = this.isDark();
    const colors = getChartColors(isDark);
    return {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        data: [this.analyticsService.incomeTotal(), this.analyticsService.expenseTotal()],
        backgroundColor: [colors[0], colors[1]],
        borderWidth: 0,
      }],
    };
  });

  protected expenseByCategoryData = computed<ChartData<'doughnut'>>(() => {
    const isDark = this.isDark();
    const colors = getChartColors(isDark);
    const expenses = this.analyticsService.expensesByCategory();
    return {
      labels: expenses.map(e => e.name),
      datasets: [{
        data: expenses.map(e => e.value),
        backgroundColor: colors.slice(0, expenses.length),
        borderWidth: 0,
      }],
    };
  });

  protected incomeByCategoryData = computed<ChartData<'doughnut'>>(() => {
    const isDark = this.isDark();
    const colors = getChartColors(isDark);
    const incomes = this.analyticsService.incomeByCategory();
    return {
      labels: incomes.map(i => i.name),
      datasets: [{
        data: incomes.map(i => i.value),
        backgroundColor: colors.slice(0, incomes.length),
        borderWidth: 0,
      }],
    };
  });

  protected trendChartData = computed<ChartData<'bar'> | null>(() => {
    const trends = this.analyticsService.spendingTrends();
    if (trends.length === 0) return null;

    const isDark = this.isDark();
    const colors = getChartColors(isDark);

    const labels = trends.map(t => {
      const [year, month] = t.month.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Receitas',
          data: trends.map(t => t.income),
          backgroundColor: colors[0],
        },
        {
          label: 'Despesas',
          data: trends.map(t => t.expenses),
          backgroundColor: colors[1],
        },
      ],
    };
  });

  protected budgetChartData = computed<ChartData<'bar'> | null>(() => {
    if (!this.analyticsService.hasPlanningData()) return null;

    const isDark = this.isDark();
    const colors = getChartColors(isDark);
    const budgets = this.analyticsService.budgetUtilization();
    if (budgets.length === 0) return null;

    return {
      labels: budgets.map(b => b.categoryName),
      datasets: [
        {
          label: 'Planejado',
          data: budgets.map(b => b.planned),
          backgroundColor: colors[2],
        },
        {
          label: 'Gasto',
          data: budgets.map(b => b.actual),
          backgroundColor: colors[1],
        },
      ],
    };
  });

  protected creditCardChartData = computed<ChartData<'bar'> | null>(() => {
    if (!this.analyticsService.hasCreditCardData()) return null;

    const cards = this.analyticsService.creditCardUsage();
    if (cards.length === 0) return null;

    const isDark = this.isDark();
    const colors = getChartColors(isDark);

    const barColors = cards.map(card => {
      if (card.usagePercent > 80) return colors[1];
      if (card.usagePercent > 60) return isDark ? '#FFA726' : '#E65100';
      return colors[0];
    });

    return {
      labels: cards.map(c => c.name),
      datasets: [{
        label: 'Uso (%)',
        data: cards.map(c => c.usagePercent),
        backgroundColor: barColors,
      }],
    };
  });

  protected savingsRate = this.analyticsService.savingsRate;
  protected savingsRateFormatted = computed(() => this.analyticsService.savingsRate().toFixed(1));
  protected insights = this.analyticsService.insights;
  protected hasTransactionData = this.analyticsService.hasTransactionData;
  protected hasPlanningData = this.analyticsService.hasPlanningData;
  protected hasCreditCardData = this.analyticsService.hasCreditCardData;

  constructor() {
    afterNextRender(() => {
      this.loading.set(false);
    });
  }
}
