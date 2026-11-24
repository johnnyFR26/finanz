import { Component, inject, signal, computed, OnInit, afterNextRender } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { PlanningService } from '../../../../services/planning.service';
import { ThemeService } from '../../../../services/themeService';
import { createBaseChartOptions, getChartColors } from '../../../../utils/chart-config';

interface ProjectionRow {
  month: string;
  monthLabel: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  activeExpenses: number;
  completedInstallments: string[];
  cumulativeSavings?: number;
}

interface Insight {
  icon: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'tip';
}

@Component({
  selector: 'app-projection',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DecimalPipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    BaseChartDirective,
  ],
  styleUrls: ['./projection.component.scss'],
  template: `
    <div class="projection">
      <button class="back" mat-icon-button (click)="router.navigate(['/home/planning'])">
        <mat-icon>keyboard_backspace</mat-icon>
      </button>

      <h2 class="page-title">
        <mat-icon>timeline</mat-icon>
        Projeção de 12 Meses — {{ planningTitle() }}
      </h2>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      }

      @if (error()) {
        <div class="error-container">
          <mat-icon>error</mat-icon>
          <span>{{ error() }}</span>
        </div>
      }

      @if (!loading() && !error() && projections().length > 0) {
        <!-- Summary Cards -->
        <div class="summary-grid">
          <div class="summary-card savings">
            <div class="card-icon"><mat-icon>savings</mat-icon></div>
            <div class="card-content">
              <span class="card-label">Economia Total Projetada</span>
              <span class="card-value">{{ totalProjectedSavings() | currency:'BRL' }}</span>
            </div>
          </div>

          <div class="summary-card commitment">
            <div class="card-icon"><mat-icon>pie_chart</mat-icon></div>
            <div class="card-content">
              <span class="card-label">Comprometimento Médio</span>
              <span class="card-value">{{ avgCommitmentRate() | number:'1.1-1' }}%</span>
            </div>
          </div>

          <div class="summary-card best-month">
            <div class="card-icon"><mat-icon>star</mat-icon></div>
            <div class="card-content">
              <span class="card-label">Melhor Mês</span>
              <span class="card-value">{{ bestMonth().label }}</span>
              <span class="card-detail">{{ bestMonth().balance | currency:'BRL' }}</span>
            </div>
          </div>

          <div class="summary-card installments">
            <div class="card-icon"><mat-icon>event_available</mat-icon></div>
            <div class="card-content">
              <span class="card-label">Parcelas Encerram</span>
              <span class="card-value">{{ totalCompletingInstallments() }}</span>
              <span class="card-detail">nos próximos 12 meses</span>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-container trend-chart">
            <h3 class="chart-title">
              <mat-icon>show_chart</mat-icon>
              Receitas vs Despesas
            </h3>
            @if (chartsReady()) {
              <div class="chart-wrapper">
                <canvas baseChart
                  [type]="'line'"
                  [data]="trendChartData()"
                  [options]="lineChartOptions()">
                </canvas>
              </div>
            }
          </div>

          <div class="chart-container balance-chart">
            <h3 class="chart-title">
              <mat-icon>bar_chart</mat-icon>
              Balanço Mensal
            </h3>
            @if (chartsReady()) {
              <div class="chart-wrapper">
                <canvas baseChart
                  [type]="'bar'"
                  [data]="balanceChartData()"
                  [options]="barChartOptions()">
                </canvas>
              </div>
            }
          </div>
        </div>

        <!-- Cumulative Savings Chart -->
        <div class="chart-container full-width-chart">
          <h3 class="chart-title">
            <mat-icon>trending_up</mat-icon>
            Economia Acumulada
          </h3>
          @if (chartsReady()) {
            <div class="chart-wrapper">
              <canvas baseChart
                [type]="'line'"
                [data]="cumulativeChartData()"
                [options]="areaChartOptions()">
              </canvas>
            </div>
          }
        </div>

        <!-- Insights Section -->
        @if (insights().length > 0) {
          <div class="insights-section">
            <h3 class="section-title">
              <mat-icon>lightbulb</mat-icon>
              Insights e Sugestões
            </h3>
            <div class="insights-grid">
              @for (insight of insights(); track insight.title) {
                <div class="insight-card" [class]="'insight-' + insight.type">
                  <mat-icon class="insight-icon">{{ insight.icon }}</mat-icon>
                  <div class="insight-content">
                    <span class="insight-title">{{ insight.title }}</span>
                    <span class="insight-desc">{{ insight.description }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <mat-divider></mat-divider>

        <!-- Detailed Table -->
        <div class="table-section">
          <h3 class="section-title">
            <mat-icon>table_chart</mat-icon>
            Projeção Detalhada
          </h3>
          <div class="table-wrapper">
            <table mat-table [dataSource]="projectionsWithCumulative()" class="projection-table">

              <ng-container matColumnDef="month">
                <th mat-header-cell *matHeaderCellDef>Mês</th>
                <td mat-cell *matCellDef="let row">{{ row.monthLabel }}</td>
              </ng-container>

              <ng-container matColumnDef="totalIncome">
                <th mat-header-cell *matHeaderCellDef>Receitas</th>
                <td mat-cell *matCellDef="let row" class="income-cell">{{ row.totalIncome | currency:'BRL' }}</td>
              </ng-container>

              <ng-container matColumnDef="totalExpenses">
                <th mat-header-cell *matHeaderCellDef>Despesas</th>
                <td mat-cell *matCellDef="let row" class="expense-cell">{{ row.totalExpenses | currency:'BRL' }}</td>
              </ng-container>

              <ng-container matColumnDef="balance">
                <th mat-header-cell *matHeaderCellDef>Balanço</th>
                <td mat-cell *matCellDef="let row"
                  [class.balance-positive]="row.balance >= 0"
                  [class.balance-negative]="row.balance < 0">
                  {{ row.balance | currency:'BRL' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="cumulativeSavings">
                <th mat-header-cell *matHeaderCellDef>Acumulado</th>
                <td mat-cell *matCellDef="let row"
                  [class.balance-positive]="row.cumulativeSavings >= 0"
                  [class.balance-negative]="row.cumulativeSavings < 0">
                  {{ row.cumulativeSavings | currency:'BRL' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="activeExpenses">
                <th mat-header-cell *matHeaderCellDef>Parcelas</th>
                <td mat-cell *matCellDef="let row">{{ row.activeExpenses }}</td>
              </ng-container>

              <ng-container matColumnDef="completedInstallments">
                <th mat-header-cell *matHeaderCellDef>Finalizadas</th>
                <td mat-cell *matCellDef="let row" class="completed-cell">
                  {{ row.completedInstallments?.join(', ') || '—' }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                [class.best-month-row]="row.monthLabel === bestMonth().label">
              </tr>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class ProjectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private planningService = inject(PlanningService);
  private themeService = inject(ThemeService);
  protected router = inject(Router);

  projections = signal<ProjectionRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  planningTitle = signal('');
  chartsReady = signal(false);

  displayedColumns = ['month', 'totalIncome', 'totalExpenses', 'balance', 'cumulativeSavings', 'activeExpenses', 'completedInstallments'];

  protected isDark = computed(() => this.themeService.getDarkTheme());

  constructor() {
    afterNextRender(() => {
      this.chartsReady.set(true);
    });
  }

  // --- Computed Metrics ---

  totalProjectedSavings = computed(() =>
    this.projections().reduce((sum, p) => sum + p.balance, 0)
  );

  avgCommitmentRate = computed(() => {
    const rows = this.projections();
    if (rows.length === 0) return 0;
    const avg = rows.reduce((sum, p) => {
      return sum + (p.totalIncome > 0 ? (p.totalExpenses / p.totalIncome) * 100 : 0);
    }, 0);
    return avg / rows.length;
  });

  bestMonth = computed(() => {
    const rows = this.projections();
    if (rows.length === 0) return { label: '—', balance: 0 };
    const best = rows.reduce((max, row) => row.balance > max.balance ? row : max, rows[0]);
    return { label: best.monthLabel, balance: best.balance };
  });

  totalCompletingInstallments = computed(() =>
    this.projections().reduce((sum, p) => sum + (p.completedInstallments?.length || 0), 0)
  );

  projectionsWithCumulative = computed<ProjectionRow[]>(() => {
    let cumulative = 0;
    return this.projections().map(p => {
      cumulative += p.balance;
      return { ...p, cumulativeSavings: cumulative };
    });
  });

  // --- Insights ---

  insights = computed<Insight[]>(() => {
    const rows = this.projections();
    if (rows.length === 0) return [];
    const result: Insight[] = [];

    // Insight: taxa de comprometimento
    const commitRate = this.avgCommitmentRate();
    if (commitRate > 80) {
      result.push({
        icon: 'warning',
        title: 'Comprometimento Alto',
        description: `Suas despesas consomem ${commitRate.toFixed(0)}% da renda. O ideal é manter abaixo de 70% para ter margem de segurança.`,
        type: 'negative',
      });
    } else if (commitRate < 50) {
      result.push({
        icon: 'thumb_up',
        title: 'Boa Margem Financeira',
        description: `Apenas ${commitRate.toFixed(0)}% da renda é comprometida com despesas. Excelente para investir o excedente.`,
        type: 'positive',
      });
    }

    // Insight: parcelas encerrando
    const completingMonths = rows.filter(r => r.completedInstallments && r.completedInstallments.length > 0);
    if (completingMonths.length > 0) {
      const firstEnd = completingMonths[0];
      const names = firstEnd.completedInstallments.join(', ');
      result.push({
        icon: 'celebration',
        title: 'Parcelas Encerrando',
        description: `Em ${firstEnd.monthLabel}, as parcelas "${names}" serão quitadas, liberando mais orçamento.`,
        type: 'positive',
      });
    }

    // Insight: tendência de balanço
    if (rows.length >= 3) {
      const firstBalance = rows[0].balance;
      const lastBalance = rows[rows.length - 1].balance;
      if (lastBalance > firstBalance) {
        result.push({
          icon: 'trending_up',
          title: 'Tendência Positiva',
          description: `Seu balanço melhora ao longo dos 12 meses — de ${this.formatBrl(firstBalance)} para ${this.formatBrl(lastBalance)}.`,
          type: 'positive',
        });
      } else if (lastBalance < firstBalance) {
        result.push({
          icon: 'trending_down',
          title: 'Atenção à Tendência',
          description: `O balanço diminui de ${this.formatBrl(firstBalance)} para ${this.formatBrl(lastBalance)}. Revise despesas variáveis.`,
          type: 'negative',
        });
      }
    }

    // Insight: melhor mês
    const best = this.bestMonth();
    if (best.balance > 0) {
      result.push({
        icon: 'emoji_events',
        title: `${best.label} — Maior Economia`,
        description: `Neste mês a projeção indica ${this.formatBrl(best.balance)} de saldo positivo. Considere direcionar para reserva de emergência ou investimentos.`,
        type: 'tip',
      });
    }

    // Insight: meses negativos
    const negativeMonths = rows.filter(r => r.balance < 0);
    if (negativeMonths.length > 0) {
      result.push({
        icon: 'report_problem',
        title: `${negativeMonths.length} ${negativeMonths.length === 1 ? 'Mês' : 'Meses'} no Vermelho`,
        description: `A projeção indica déficit em: ${negativeMonths.map(m => m.monthLabel).join(', ')}. Planeje uma reserva para cobrir esses períodos.`,
        type: 'negative',
      });
    }

    // Insight: economia acumulada
    const totalSavings = this.totalProjectedSavings();
    if (totalSavings > 0) {
      result.push({
        icon: 'account_balance',
        title: 'Economia ao Final do Período',
        description: `Se o plano for seguido, você terá acumulado ${this.formatBrl(totalSavings)} em 12 meses.`,
        type: 'tip',
      });
    }

    // Insight: regra 50/30/20
    const incomeMonth = rows[0]?.totalIncome || 0;
    if (incomeMonth > 0) {
      const needsPercent = commitRate;
      result.push({
        icon: 'balance',
        title: 'Regra 50/30/20',
        description: `Suas necessidades consomem ~${needsPercent.toFixed(0)}% da renda. A regra sugere: 50% necessidades, 30% desejos e 20% poupança/investimentos.`,
        type: 'neutral',
      });
    }

    return result;
  });

  // --- Chart Data ---

  trendChartData = computed<ChartData<'line'>>(() => {
    const rows = this.projections();
    const colors = getChartColors(this.isDark());
    return {
      labels: rows.map(r => r.monthLabel),
      datasets: [
        {
          label: 'Receitas',
          data: rows.map(r => r.totalIncome),
          borderColor: colors[0],
          backgroundColor: colors[0] + '33',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Despesas',
          data: rows.map(r => r.totalExpenses),
          borderColor: colors[1],
          backgroundColor: colors[1] + '33',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  });

  balanceChartData = computed<ChartData<'bar'>>(() => {
    const rows = this.projections();
    const colors = getChartColors(this.isDark());
    return {
      labels: rows.map(r => r.monthLabel),
      datasets: [{
        label: 'Balanço',
        data: rows.map(r => r.balance),
        backgroundColor: rows.map(r => r.balance >= 0 ? colors[0] + 'CC' : colors[1] + 'CC'),
        borderColor: rows.map(r => r.balance >= 0 ? colors[0] : colors[1]),
        borderWidth: 1,
        borderRadius: 4,
      }],
    };
  });

  cumulativeChartData = computed<ChartData<'line'>>(() => {
    const rows = this.projectionsWithCumulative();
    const isDark = this.isDark();
    const colors = getChartColors(isDark);
    return {
      labels: rows.map(r => r.monthLabel),
      datasets: [{
        label: 'Economia Acumulada',
        data: rows.map(r => r.cumulativeSavings!),
        borderColor: colors[2],
        backgroundColor: colors[2] + '22',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: colors[2],
      }],
    };
  });

  // --- Chart Options ---

  lineChartOptions = computed<ChartOptions<'line'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark) as ChartOptions<'line'>;
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const fontColor = isDark ? '#f0f8ff' : '#181824';
    const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    return {
      ...base,
      scales: {
        x: {
          ticks: { color: fontColor, maxRotation: 45 },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: fontColor,
            callback: (value) => brl.format(Number(value)),
          },
          grid: { color: gridColor },
        },
      },
    };
  });

  barChartOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark) as ChartOptions<'bar'>;
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const fontColor = isDark ? '#f0f8ff' : '#181824';
    const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    return {
      ...base,
      scales: {
        x: {
          ticks: { color: fontColor, maxRotation: 45 },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: fontColor,
            callback: (value) => brl.format(Number(value)),
          },
          grid: { color: gridColor },
        },
      },
    };
  });

  areaChartOptions = computed<ChartOptions<'line'>>(() => {
    const isDark = this.isDark();
    const base = createBaseChartOptions(isDark) as ChartOptions<'line'>;
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const fontColor = isDark ? '#f0f8ff' : '#181824';
    const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    return {
      ...base,
      scales: {
        x: {
          ticks: { color: fontColor, maxRotation: 45 },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: fontColor,
            callback: (value) => brl.format(Number(value)),
          },
          grid: { color: gridColor },
        },
      },
    };
  });

  // --- Helpers ---

  private formatBrl(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID do planejamento não encontrado.');
      this.loading.set(false);
      return;
    }

    this.planningService.getProjection(id).subscribe({
      next: (data) => {
        this.planningTitle.set(data.planningTitle || '');
        this.projections.set(data.projections || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar projeção. Tente novamente.');
        this.loading.set(false);
      },
    });
  }
}
