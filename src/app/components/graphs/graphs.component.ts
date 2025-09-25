import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from './../../../../node_modules/chart.js/dist/types/index.d';
import { Component, computed, effect, inject, OnInit } from "@angular/core";
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
    return this.categories().map(c => c.name)
  })
  simpleOutputSums = computed(() => {

  return this.categories().map(category => 
    // @ts-ignore
    category?.transactions
      .filter(transaction => transaction.type === 'output')
      .reduce((sum, transaction) => sum + parseFloat(transaction.value), 0)
  );
});

  simpleInputSums = computed(() => {

  return this.categories().map(category => 
    // @ts-ignore
    category?.transactions
      .filter(transaction => transaction.type === 'input')
      .reduce((sum, transaction) => sum + parseFloat(transaction.value), 0)
  );
});
colors = [
  "#FF5733", // Laranja avermelhado
  "#33FF57", // Verde
  "#3357FF", // Azul
  "#FF33A6", // Rosa
  "#FFD433", // Amarelo
  "#33FFF3", // Ciano
  "#8E33FF", // Roxo
  "#FF8C33", // Laranja
  "#33FF8C", // Verde claro
  "#FF3333"  // Vermelho
]

  constructor() {
    effect(() => {
      this.categories = this.categoryService.getCurrentCategories()
    })
  }
  


  doughnutChartData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      data: [this.sum(), this.sub()],
      backgroundColor: ['#9FF04C', '#E74C3C'],
      borderWidth: 0,
    }]
  };

  // Gráfico Despesas por Categoria
  categoryChartData = {
    labels: this.categories().map(c => c.name),
    datasets: [{
      data: [30, 20, 25, 15, 10],
      backgroundColor: ['#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'],
    }]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
}