import {
  Component, inject, computed, signal, afterNextRender,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { CategoryService } from '../../../services/category.service';
import { CreditCardService } from '../../../services/credit-card.service';
import { PlanningService } from '../../../services/planning.service';
import { WalletsService } from '../../../services/wallets.service';
import { ThemeService } from '../../../services/themeService';
import {
  createBaseChartOptions, getChartColors, topNWithOthers, groupTransactionsByMonth,
} from '../../../utils/chart-config';

// ── Interfaces ──────────────────────────────────────────────────
interface HealthFactor {
  label: string;
  score: number;   // 0-25
  max: number;
  icon: string;
  status: 'good' | 'warning' | 'danger';
}

interface Insight {
  icon: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'tip';
}

// ── Component ───────────────────────────────────────────────────
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DecimalPipe,
    MatIconModule, MatButtonModule, MatDividerModule,
    MatProgressBarModule, MatProgressSpinnerModule,
    BaseChartDirective,
  ],
  styleUrls: ['./overview.component.scss'],
  template: `
<div class="overview">

  <!-- ═══ Health Score Hero ═══ -->
  <section class="health-hero">
    <div class="score-ring" [class]="healthGrade()">
      <span class="score-value">{{ healthScore() }}</span>
      <span class="score-label">/ 100</span>
    </div>
    <div class="score-info">
      <h2 class="score-title">Saúde Financeira</h2>
      <span class="score-grade" [class]="healthGrade()">{{ healthGradeLabel() }}</span>
      <p class="score-hint">Baseado em poupança, crédito, orçamento e investimentos</p>
    </div>
  </section>

  <!-- ═══ Health Factors ═══ -->
  <section class="factors-row">
    @for (factor of healthFactors(); track factor.label) {
      <div class="factor-card" [class]="'factor-' + factor.status">
        <mat-icon>{{ factor.icon }}</mat-icon>
        <div class="factor-body">
          <span class="factor-label">{{ factor.label }}</span>
          <mat-progress-bar mode="determinate"
            [value]="factor.score / factor.max * 100">
          </mat-progress-bar>
          <span class="factor-score">{{ factor.score }}/{{ factor.max }}</span>
        </div>
      </div>
    }
  </section>

  <mat-divider></mat-divider>

  <!-- ═══ Summary Cards ═══ -->
  <section class="summary-grid">
    <div class="stat-card balance-card" (click)="router.navigate(['/home/account'])">
      <mat-icon>account_balance_wallet</mat-icon>
      <div>
        <span class="stat-label">Saldo em Conta</span>
        <span class="stat-value">{{ accountBalance() | currency: currency() }}</span>
      </div>
    </div>
    <div class="stat-card income-card">
      <mat-icon>arrow_downward</mat-icon>
      <div>
        <span class="stat-label">Receitas</span>
        <span class="stat-value">{{ totalIncome() | currency: currency() }}</span>
      </div>
    </div>
    <div class="stat-card expense-card">
      <mat-icon>arrow_upward</mat-icon>
      <div>
        <span class="stat-label">Despesas</span>
        <span class="stat-value">{{ totalExpenses() | currency: currency() }}</span>
      </div>
    </div>
    <div class="stat-card savings-card">
      <mat-icon>savings</mat-icon>
      <div>
        <span class="stat-label">Economia</span>
        <span class="stat-value">{{ savingsRate() | number:'1.1-1' }}%</span>
      </div>
    </div>
    <div class="stat-card invest-card" (click)="router.navigate(['/home/wallets'])">
      <mat-icon>trending_up</mat-icon>
      <div>
        <span class="stat-label">Patrimônio Investido</span>
        <span class="stat-value">{{ totalInvested() | currency: currency() }}</span>
      </div>
    </div>
    <div class="stat-card net-card">
      <mat-icon>diamond</mat-icon>
      <div>
        <span class="stat-label">Patrimônio Total</span>
        <span class="stat-value">{{ netWorth() | currency: currency() }}</span>
      </div>
    </div>
  </section>

  <mat-divider></mat-divider>

  <!-- ═══ Charts Row 1: Receitas/Despesas + Top Categorias ═══ -->
  <section class="charts-row">
    <div class="chart-box">
      <h3 class="chart-label"><mat-icon>donut_large</mat-icon> Receitas vs Despesas</h3>
      @if (chartsReady() && hasTransactions()) {
        <div class="chart-wrap doughnut-wrap">
          <canvas baseChart [type]="'doughnut'"
            [data]="incomeExpenseChart()" [options]="doughnutOptions()">
          </canvas>
        </div>
      } @else {
        <div class="chart-empty"><mat-icon>info</mat-icon> Sem transações neste mês</div>
      }
    </div>

    <div class="chart-box">
      <h3 class="chart-label"><mat-icon>category</mat-icon> Gastos por Categoria</h3>
      @if (chartsReady() && hasTransactions()) {
        <div class="chart-wrap">
          <canvas baseChart [type]="'bar'"
            [data]="categoryExpenseChart()" [options]="horizontalBarOptions()">
          </canvas>
        </div>
      } @else {
        <div class="chart-empty"><mat-icon>info</mat-icon> Sem gastos categorizados</div>
      }
    </div>
  </section>

  <!-- ═══ Charts Row 2: Tendência + Cartões ═══ -->
  <section class="charts-row">
    <div class="chart-box">
      <h3 class="chart-label"><mat-icon>show_chart</mat-icon> Tendência (6 meses)</h3>
      @if (chartsReady() && trendChart()) {
        <div class="chart-wrap">
          <canvas baseChart [type]="'bar'"
            [data]="trendChart()!" [options]="barChartOptions()">
          </canvas>
        </div>
      } @else {
        <div class="chart-empty"><mat-icon>info</mat-icon> Dados insuficientes</div>
      }
    </div>

    <div class="chart-box">
      <h3 class="chart-label"><mat-icon>credit_card</mat-icon> Uso dos Cartões</h3>
      @if (chartsReady() && hasCreditCards()) {
        <div class="chart-wrap">
          <canvas baseChart [type]="'bar'"
            [data]="creditCardChart()" [options]="creditCardOptions()">
          </canvas>
        </div>
      } @else {
        <div class="chart-empty"><mat-icon>info</mat-icon> Nenhum cartão cadastrado</div>
      }
    </div>
  </section>

  <!-- ═══ Budget Compliance ═══ -->
  @if (hasBudget()) {
    <mat-divider></mat-divider>
    <section class="budget-section">
      <h3 class="section-title"><mat-icon>rule</mat-icon> Orçamento vs Real</h3>
      <div class="budget-grid">
        @for (b of budgetItems(); track b.categoryName) {
          <div class="budget-item">
            <div class="budget-header">
              <span class="budget-name">{{ b.categoryName }}</span>
              <span class="budget-pct" [class.over]="b.percent > 100">{{ b.percent | number:'1.0-0' }}%</span>
            </div>
            <mat-progress-bar mode="determinate"
              [value]="b.percent > 100 ? 100 : b.percent"
              [color]="b.percent > 90 ? 'warn' : 'primary'">
            </mat-progress-bar>
            <div class="budget-values">
              <span>Gasto: {{ b.actual | currency: currency() }}</span>
              <span>Limite: {{ b.planned | currency: currency() }}</span>
            </div>
          </div>
        }
      </div>
    </section>
  }

  <!-- ═══ Investments ═══ -->
  @if (holdings().length > 0) {
    <mat-divider></mat-divider>
    <section class="invest-section">
      <h3 class="section-title"><mat-icon>account_balance</mat-icon> Investimentos</h3>
      <div class="invest-grid">
        @for (h of holdings(); track h.id) {
          <div class="invest-item">
            <mat-icon>{{ h.controls?.icon || 'monetization_on' }}</mat-icon>
            <div class="invest-body">
              <span class="invest-name">{{ h.name }}</span>
              <span class="invest-value">{{ h.total | currency: currency() }}</span>
              <span class="invest-detail">Rentabilidade: {{ h.tax }}% · {{ h.controls?.type === 'daily' ? 'Diária' : 'Mensal' }}</span>
            </div>
          </div>
        }
      </div>
    </section>
  }

  <mat-divider></mat-divider>

  <!-- ═══ Insights ═══ -->
  <section class="insights-section">
    <h3 class="section-title"><mat-icon>lightbulb</mat-icon> Insights e Recomendações</h3>
    <div class="insights-grid">
      @for (ins of allInsights(); track ins.title) {
        <div class="insight-card" [class]="'insight-' + ins.type">
          <mat-icon>{{ ins.icon }}</mat-icon>
          <div>
            <span class="insight-title">{{ ins.title }}</span>
            <span class="insight-desc">{{ ins.description }}</span>
          </div>
        </div>
      }
    </div>
  </section>

</div>
  `
})
export class OverviewComponent {
  protected router = inject(Router);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private creditCardService = inject(CreditCardService);
  private planningService = inject(PlanningService);
  private walletsService = inject(WalletsService);
  private themeService = inject(ThemeService);

  chartsReady = signal(false);

  constructor() {
    afterNextRender(() => this.chartsReady.set(true));
  }

  // ── Raw data signals ──────────────────────────────────────────
  protected isDark = computed(() => this.themeService.getDarkTheme());
  private account = this.accountService.getCurrentAccount();
  protected currency = computed(() => this.account()?.currency || 'BRL');
  protected accountBalance = computed(() => this.account()?.currentValue || 0);

  protected totalIncome = this.transactionService.sum;
  protected totalExpenses = this.transactionService.sub;
  protected cashFlow = computed(() => this.totalIncome() - this.totalExpenses());

  protected savingsRate = computed(() => {
    const inc = this.totalIncome();
    return inc > 0 ? ((inc - this.totalExpenses()) / inc) * 100 : 0;
  });

  protected holdings = this.walletsService.getHoldings();
  protected totalInvested = computed(() =>
    this.holdings().reduce((s, h) => s + Number(h.total), 0)
  );

  protected netWorth = computed(() =>
    this.accountBalance() + this.totalInvested()
  );

  protected hasTransactions = computed(() =>
    this.categoryService.getCurrentCategories()().some(c => (c.transactions?.length ?? 0) > 0)
  );

  protected hasCreditCards = computed(() =>
    this.creditCardService.getCurrentCreditCard()().length > 0
  );

  protected hasBudget = computed(() =>
    this.planningService.getPlanningsSignal()().length > 0
  );

  // ── Health Score (0-100) ──────────────────────────────────────
  protected healthFactors = computed<HealthFactor[]>(() => {
    const factors: HealthFactor[] = [];

    // 1. Savings (0-25)
    const sr = this.savingsRate();
    const savScore = Math.min(25, Math.round(sr > 0 ? (sr / 20) * 25 : 0));
    factors.push({
      label: 'Poupança',
      score: savScore, max: 25, icon: 'savings',
      status: savScore >= 18 ? 'good' : savScore >= 10 ? 'warning' : 'danger',
    });

    // 2. Credit utilization (0-25)
    const cards = this.creditCardService.getCurrentCreditCard()();
    let creditScore = 25;
    if (cards.length > 0) {
      const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
      const totalUsed = cards.reduce((s, c) => s + (c.limit - c.availableLimit), 0);
      const utilization = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
      creditScore = Math.max(0, Math.round(25 - (utilization / 100) * 25));
    }
    factors.push({
      label: 'Crédito',
      score: creditScore, max: 25, icon: 'credit_score',
      status: creditScore >= 18 ? 'good' : creditScore >= 10 ? 'warning' : 'danger',
    });

    // 3. Budget compliance (0-25)
    const plannings = this.planningService.getPlanningsSignal()();
    let budgetScore = 15; // neutral when no budget
    if (plannings.length > 0) {
      const cats = plannings.flatMap(p => p.planningCategories ?? []);
      if (cats.length > 0) {
        const overBudgetCount = cats.filter((c: any) =>
          (Number(c.limit) - Number(c.availableLimit)) > Number(c.limit)
        ).length;
        const complianceRate = 1 - (overBudgetCount / cats.length);
        budgetScore = Math.round(complianceRate * 25);
      }
    }
    factors.push({
      label: 'Orçamento',
      score: budgetScore, max: 25, icon: 'rule',
      status: budgetScore >= 18 ? 'good' : budgetScore >= 10 ? 'warning' : 'danger',
    });

    // 4. Investments (0-25)
    const invested = this.totalInvested();
    const balance = this.accountBalance();
    const total = invested + balance;
    let investScore = 0;
    if (total > 0) {
      const ratio = invested / total;
      investScore = Math.min(25, Math.round(ratio * 50)); // 50% invested = max
    }
    factors.push({
      label: 'Investimentos',
      score: investScore, max: 25, icon: 'trending_up',
      status: investScore >= 18 ? 'good' : investScore >= 10 ? 'warning' : 'danger',
    });

    return factors;
  });

  protected healthScore = computed(() =>
    this.healthFactors().reduce((s, f) => s + f.score, 0)
  );

  protected healthGrade = computed(() => {
    const s = this.healthScore();
    if (s >= 80) return 'excellent';
    if (s >= 60) return 'good';
    if (s >= 40) return 'fair';
    return 'poor';
  });

  protected healthGradeLabel = computed(() => {
    const map: Record<string, string> = {
      excellent: 'Excelente', good: 'Boa', fair: 'Regular', poor: 'Atenção',
    };
    return map[this.healthGrade()];
  });

  // ── Budget items ──────────────────────────────────────────────
  protected budgetItems = computed(() => {
    const plannings = this.planningService.getPlanningsSignal()();
    return plannings.flatMap(p => (p.planningCategories ?? []).map((pc: any) => ({
      categoryName: pc.category?.name ?? pc.categoryName ?? 'Sem nome',
      planned: Number(pc.limit) || 0,
      actual: (Number(pc.limit) || 0) - (Number(pc.availableLimit) || 0),
      percent: Number(pc.limit) > 0
        ? (((Number(pc.limit) - (Number(pc.availableLimit) || 0)) / Number(pc.limit)) * 100)
        : 0,
    })));
  });

  // ── Chart Data ────────────────────────────────────────────────
  protected incomeExpenseChart = computed<ChartData<'doughnut'>>(() => {
    const colors = getChartColors(this.isDark());
    return {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        data: [this.totalIncome(), this.totalExpenses()],
        backgroundColor: [colors[0], colors[1]],
        borderWidth: 0,
        hoverOffset: 8,
      }],
    };
  });

  protected categoryExpenseChart = computed<ChartData<'bar'>>(() => {
    const categories = this.categoryService.getCurrentCategories()();
    const colors = getChartColors(this.isDark());
    const items = categories.map(c => ({
      name: c.name,
      value: (c.transactions ?? [])
        .filter(t => t.type === 'output')
        .reduce((s, t) => s + parseFloat(t.value), 0),
    })).filter(i => i.value > 0);
    const top = topNWithOthers(items, 7);
    return {
      labels: top.map(i => i.name),
      datasets: [{
        label: 'Gastos',
        data: top.map(i => i.value),
        backgroundColor: colors.slice(0, top.length),
        borderRadius: 4,
      }],
    };
  });

  protected trendChart = computed<ChartData<'bar'> | null>(() => {
    const categories = this.categoryService.getCurrentCategories()();
    const all = categories.flatMap(c => c.transactions ?? []);
    const grouped = groupTransactionsByMonth(all);
    const entries = Array.from(grouped.values()).slice(-6);
    if (entries.length < 2) return null;
    const colors = getChartColors(this.isDark());
    return {
      labels: entries.map(e => {
        const [y, m] = e.month.split('-');
        return new Date(+y, +m - 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      }),
      datasets: [
        { label: 'Receitas', data: entries.map(e => e.income), backgroundColor: colors[0], borderRadius: 4 },
        { label: 'Despesas', data: entries.map(e => e.expenses), backgroundColor: colors[1], borderRadius: 4 },
      ],
    };
  });

  protected creditCardChart = computed<ChartData<'bar'>>(() => {
    const cards = this.creditCardService.getCurrentCreditCard()();
    const colors = getChartColors(this.isDark());
    const usages = cards.map(c => ({
      name: c.name,
      pct: c.limit > 0 ? ((c.limit - c.availableLimit) / c.limit) * 100 : 0,
    }));
    return {
      labels: usages.map(u => u.name),
      datasets: [{
        label: 'Uso (%)',
        data: usages.map(u => u.pct),
        backgroundColor: usages.map(u => {
          if (u.pct > 80) return colors[1];
          if (u.pct > 60) return this.isDark() ? '#FFA726' : '#E65100';
          return colors[0];
        }),
        borderRadius: 4,
      }],
    };
  });

  // ── Chart Options ─────────────────────────────────────────────
  protected doughnutOptions = computed<ChartOptions<'doughnut'>>(() => {
    const base = createBaseChartOptions(this.isDark());
    return { ...base, cutout: '60%' } as ChartOptions<'doughnut'>;
  });

  protected barChartOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark);
    const gc = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const fc = isDark ? '#f0f8ff' : '#181824';
    const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    return {
      ...base,
      scales: {
        x: { ticks: { color: fc, maxRotation: 45 }, grid: { color: gc } },
        y: { ticks: { color: fc, callback: v => brl.format(Number(v)) }, grid: { color: gc } },
      },
    } as ChartOptions<'bar'>;
  });

  protected horizontalBarOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark);
    const gc = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const fc = isDark ? '#f0f8ff' : '#181824';
    const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    return {
      ...base,
      indexAxis: 'y',
      scales: {
        x: { ticks: { color: fc, callback: v => brl.format(Number(v)) }, grid: { color: gc } },
        y: { ticks: { color: fc }, grid: { color: gc } },
      },
    } as ChartOptions<'bar'>;
  });

  protected creditCardOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark);
    const gc = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const fc = isDark ? '#f0f8ff' : '#181824';
    return {
      ...base,
      plugins: {
        ...base.plugins,
        tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${Number(ctx.raw).toFixed(1)}%` } },
      },
      scales: {
        x: { ticks: { color: fc }, grid: { color: gc } },
        y: { ticks: { color: fc, callback: (v: any) => `${v}%` }, grid: { color: gc }, max: 100 },
      },
    } as ChartOptions<'bar'>;
  });

  // ── Insights ──────────────────────────────────────────────────
  protected allInsights = computed<Insight[]>(() => {
    const ins: Insight[] = [];
    const inc = this.totalIncome();
    const exp = this.totalExpenses();
    const sr = this.savingsRate();
    const brl = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    // Savings
    if (sr >= 20) {
      ins.push({ icon: 'emoji_events', title: 'Meta de Poupança Atingida', type: 'positive',
        description: `Você está economizando ${sr.toFixed(1)}% da renda — acima dos 20% recomendados pela regra 50/30/20.` });
    } else if (sr > 0) {
      ins.push({ icon: 'info', title: 'Economia Abaixo do Ideal', type: 'neutral',
        description: `Sua taxa de poupança é ${sr.toFixed(1)}%. Tente alcançar 20% para uma reserva saudável.` });
    } else if (inc > 0) {
      ins.push({ icon: 'warning', title: 'Gastos Superam Receitas', type: 'negative',
        description: `Você gastou ${brl(exp - inc)} a mais que recebeu. Revise despesas não essenciais.` });
    }

    // Credit cards
    const cards = this.creditCardService.getCurrentCreditCard()();
    const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
    const totalUsed = cards.reduce((s, c) => s + (c.limit - c.availableLimit), 0);
    if (totalLimit > 0) {
      const pct = (totalUsed / totalLimit) * 100;
      if (pct > 70) {
        ins.push({ icon: 'credit_card', title: 'Uso de Crédito Elevado', type: 'negative',
          description: `${pct.toFixed(0)}% do limite total dos cartões está comprometido. Acima de 30% pode impactar seu score.` });
      } else if (pct < 30) {
        ins.push({ icon: 'verified', title: 'Uso de Crédito Saudável', type: 'positive',
          description: `Apenas ${pct.toFixed(0)}% do limite utilizado — ótimo para manter um bom score de crédito.` });
      }
    }

    // Individual card alerts
    for (const card of cards) {
      const usage = card.limit > 0 ? ((card.limit - card.availableLimit) / card.limit) * 100 : 0;
      if (usage > 85) {
        ins.push({ icon: 'report_problem', title: `${card.name} — Limite Crítico`, type: 'negative',
          description: `Cartão com ${usage.toFixed(0)}% de uso. Resta apenas ${brl(card.availableLimit)}.` });
      }
    }

    // Investments
    const invested = this.totalInvested();
    const nw = this.netWorth();
    if (invested === 0 && inc > 0) {
      ins.push({ icon: 'lightbulb', title: 'Comece a Investir', type: 'tip',
        description: 'Você ainda não tem investimentos registrados. Mesmo pequenos aportes mensais fazem diferença no longo prazo.' });
    } else if (nw > 0 && invested > 0) {
      const ratio = (invested / nw) * 100;
      ins.push({ icon: 'pie_chart', title: 'Alocação Patrimonial', type: 'neutral',
        description: `${ratio.toFixed(0)}% do seu patrimônio está investido e ${(100 - ratio).toFixed(0)}% em conta corrente.` });
    }

    // Budget compliance
    const budgets = this.budgetItems();
    const overBudget = budgets.filter(b => b.percent > 100);
    if (overBudget.length > 0) {
      ins.push({ icon: 'rule', title: `${overBudget.length} ${overBudget.length === 1 ? 'Categoria' : 'Categorias'} Estourou o Orçamento`, type: 'negative',
        description: `${overBudget.map(b => b.categoryName).join(', ')} — considere realocar limites no próximo planejamento.` });
    } else if (budgets.length > 0) {
      ins.push({ icon: 'check_circle', title: 'Orçamento Sob Controle', type: 'positive',
        description: 'Nenhuma categoria ultrapassou o limite planejado. Continue assim!' });
    }

    // Cash flow
    if (inc > 0 && exp > 0) {
      const commitRate = (exp / inc) * 100;
      ins.push({ icon: 'balance', title: 'Regra 50/30/20', type: 'tip',
        description: `Necessidades: ~${commitRate.toFixed(0)}% da renda. Recomendação: 50% necessidades, 30% desejos, 20% poupança.` });
    }

    // Emergency fund check
    if (this.accountBalance() > 0 && exp > 0) {
      const months = this.accountBalance() / exp;
      if (months < 3) {
        ins.push({ icon: 'shield', title: 'Reserva de Emergência Baixa', type: 'negative',
          description: `Seu saldo cobre ${months.toFixed(1)} meses de despesas. O ideal é ter pelo menos 6 meses.` });
      } else if (months >= 6) {
        ins.push({ icon: 'security', title: 'Reserva de Emergência Sólida', type: 'positive',
          description: `Saldo cobre ${months.toFixed(1)} meses — acima do mínimo recomendado de 6 meses.` });
      }
    }

    return ins;
  });
}
