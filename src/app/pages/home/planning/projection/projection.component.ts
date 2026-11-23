import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlanningService } from '../../../../services/planning.service';

@Component({
  selector: 'app-projection',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  styleUrls: ['./projection.component.scss'],
  template: `
    <div class="projection">
      <button class="back" mat-icon-button (click)="router.navigate(['/home/planning'])">
        <mat-icon>keyboard_backspace</mat-icon>
      </button>

      <mat-card class="projection-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>timeline</mat-icon>
            Projeção de 12 Meses — {{ planningTitle() }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
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
            <table mat-table [dataSource]="projections()" class="projection-table">

              <ng-container matColumnDef="month">
                <th mat-header-cell *matHeaderCellDef>Mês</th>
                <td mat-cell *matCellDef="let row">{{ row.monthLabel }}</td>
              </ng-container>

              <ng-container matColumnDef="totalIncome">
                <th mat-header-cell *matHeaderCellDef>Receitas</th>
                <td mat-cell *matCellDef="let row">{{ row.totalIncome | currency:'BRL' }}</td>
              </ng-container>

              <ng-container matColumnDef="totalExpenses">
                <th mat-header-cell *matHeaderCellDef>Despesas</th>
                <td mat-cell *matCellDef="let row">{{ row.totalExpenses | currency:'BRL' }}</td>
              </ng-container>

              <ng-container matColumnDef="balance">
                <th mat-header-cell *matHeaderCellDef>Balanço</th>
                <td mat-cell *matCellDef="let row"
                  [class.balance-positive]="row.balance >= 0"
                  [class.balance-negative]="row.balance < 0">
                  {{ row.balance | currency:'BRL' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="activeExpenses">
                <th mat-header-cell *matHeaderCellDef>Parcelas Ativas</th>
                <td mat-cell *matCellDef="let row">{{ row.activeExpenses }}</td>
              </ng-container>

              <ng-container matColumnDef="completedInstallments">
                <th mat-header-cell *matHeaderCellDef>Parcelas Finalizadas</th>
                <td mat-cell *matCellDef="let row">{{ row.completedInstallments?.join(', ') || '—' }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProjectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private planningService = inject(PlanningService);
  protected router = inject(Router);

  projections = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  planningTitle = signal('');

  displayedColumns = ['month', 'totalIncome', 'totalExpenses', 'balance', 'activeExpenses', 'completedInstallments'];

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
      }
    });
  }
}
