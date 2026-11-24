import { ChartOptions, TooltipItem } from 'chart.js';
import { TransactionModel } from '../models/transaction.model';

/** WCAG AA 3:1 contrast-safe palette for light theme (bg #DFE3EB) */
export const CHART_COLORS_LIGHT: string[] = [
  '#2E7D32', // green (income / --green)
  '#C62828', // red (expense / --red)
  '#1565C0', // blue (neutral / --blue)
  '#6A1B9A', // purple
  '#E65100', // orange
  '#00695C', // teal
  '#4E342E', // brown
  '#37474F', // blue grey
  '#AD1457', // pink
  '#283593', // indigo
];

/** WCAG AA 3:1 contrast-safe palette for dark theme (bg #282838) */
export const CHART_COLORS_DARK: string[] = [
  '#66BB6A', // green (income / --green)
  '#EF5350', // red (expense / --red)
  '#42A5F5', // blue (neutral / --blue)
  '#AB47BC', // purple
  '#FFA726', // orange
  '#26A69A', // teal
  '#BCAAA4', // brown
  '#78909C', // blue grey
  '#EC407A', // pink
  '#5C6BC0', // indigo
];

export function getChartColors(isDark: boolean): string[] {
  return isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
}

export function createBrlTooltipCallback(): { label: (context: TooltipItem<any>) => string } {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return {
    label: (context: TooltipItem<any>): string => {
      const label = context.dataset.label || context.label || '';
      const raw = context.raw;
      const value = typeof raw === 'number' ? raw : parseFloat(String(raw));
      return `${label}: ${formatter.format(value)}`;
    },
  };
}

export function createBaseChartOptions(isDark: boolean): ChartOptions {
  const fontColor = isDark ? '#f0f8ff' : '#181824';
  return {
    responsive: true,
    maintainAspectRatio: false,
    color: fontColor,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: fontColor,
        },
      },
      tooltip: {
        callbacks: createBrlTooltipCallback(),
      },
    },
    animation: {
      duration: 300,
    },
  };
}

/**
 * Returns the top N items sorted by value descending, plus an "Outros"
 * entry summing everything else (Miller's Law — default n=7).
 */
export function topNWithOthers<T extends { name: string; value: number }>(
  items: T[],
  n: number = 7,
): T[] {
  if (items.length <= n) {
    return [...items].sort((a, b) => b.value - a.value);
  }
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const topItems = sorted.slice(0, n);
  const rest = sorted.slice(n);
  const othersValue = rest.reduce((sum, item) => sum + item.value, 0);
  return [...topItems, { name: 'Outros', value: othersValue } as T];
}

/**
 * Groups transactions by YYYY-MM key, separating income (type=input)
 * and expenses (type=output). Returns a Map sorted by date ascending.
 */
export function groupTransactionsByMonth(
  transactions: TransactionModel[],
): Map<string, { income: number; expenses: number; month: string }> {
  const map = new Map<string, { income: number; expenses: number; month: string }>();

  for (const t of transactions) {
    const date = new Date(t.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!map.has(key)) {
      map.set(key, { income: 0, expenses: 0, month: key });
    }

    const entry = map.get(key)!;
    const value = parseFloat(t.value);

    if (t.type === 'input') {
      entry.income += value;
    } else if (t.type === 'output') {
      entry.expenses += value;
    }
  }

  return new Map(
    [...map.entries()].sort(([a], [b]) => a.localeCompare(b)),
  );
}
