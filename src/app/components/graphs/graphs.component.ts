import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from './../../../../node_modules/chart.js/dist/types/index.d';
import { Component, computed, effect, inject } from "@angular/core";
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-graphs',
    templateUrl: './graphs.component.html',
    styleUrls: ['./graphs.component.scss'],
    imports: [BaseChartDirective],
})
export class GraphsComponent {
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  protected categories = this.categoryService.getCurrentCategories();
  protected sum = this.transactionService.sum; 
  protected sub = this.transactionService.sub;

  categoriesNames = computed(() => {
    return this.categories().map(c => c?.name).filter(name => name != null);
  });

  simpleOutputSums = computed(() => {
    return this.categories().map(category => 
      (category?.transactions ?? [])
        .filter(transaction => transaction.type === 'output')
        .reduce((sum, transaction) => sum + parseFloat(transaction.value), 0)
    );
  });

  simpleInputSums = computed(() => {
    return this.categories().map(category => 
      (category?.transactions ?? [])
        .filter(transaction => transaction.type === 'input')
        .reduce((sum, transaction) => sum + parseFloat(transaction.value), 0)
    );
  });

  colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD433",
    "#33FFF3", "#8E33FF", "#FF8C33", "#33FF8C", "#FF3333"
  ];

  doughnutChartData = computed(() => ({
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      data: [this.sum(), this.sub()],
      backgroundColor: ['#9FF04C', '#E74C3C'],
      borderWidth: 0,
    }]
  }));

  categoryChartData = computed(() => ({
    labels: this.categories().map(c => c?.name).filter(name => name != null),
    datasets: [{
      data: this.simpleOutputSums(),
      backgroundColor: this.colors.slice(0, this.categories().length),
    }]
  }));

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor() {
    effect(() => {
      this.categories = this.categoryService.getCurrentCategories();
    });
  }
}