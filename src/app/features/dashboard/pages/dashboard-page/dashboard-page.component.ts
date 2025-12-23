import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Task, TaskStatus } from '../../../tasks/models/task.models';
import { TaskApi } from '../../../tasks/data/task.api';
import { TASK_STATUS_LABEL } from '../../../tasks/models/task-status.ui';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly api = inject(TaskApi);

  readonly loading = signal(false);
  readonly tasks = signal<Task[]>([]);

  private rootStatus?: am5.Root;
  private rootDaily?: am5.Root;

  readonly total = computed(() => this.tasks().length);

  readonly statusCounts = computed(() => {
    const list = this.tasks();
    const counts: Record<TaskStatus, number> = { PENDING: 0, IN_PROGRESS: 0, DONE: 0 };
    for (const t of list) counts[t.status]++;
    return counts;
  });

  private readonly byStatus = computed(() => {
    const counts = this.statusCounts();
    return (Object.keys(counts) as TaskStatus[]).map((s) => ({
      category: TASK_STATUS_LABEL[s] ?? s,
      value: counts[s],
      raw: s,
    }));
  });

  private readonly byDay = computed(() => {
    const list = this.tasks();
    const now = new Date();

    const days: { key: string; label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');

      const key = `${yyyy}-${mm}-${dd}`;
      const label = `${dd}/${mm}`;
      days.push({ key, label, value: 0 });
    }

    const index = new Map(days.map(d => [d.key, d]));

    for (const t of list) {
        const dt = new Date(t.createdAt);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
      
        let entry = index.get(key);
        if (!entry) {
          entry = { key, label: `${dd}/${mm}/${yyyy}`, value: 0 };
          index.set(key, entry);
        }
        entry.value += 1;
      }      

    return days.map(d => ({ category: d.label, value: d.value }));
  });

  ngAfterViewInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.api.list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.tasks.set(data ?? []);
          this.renderCharts();
        },
      });
  }

  private renderCharts(): void {
    this.disposeCharts();

    // ===== Pie (status) =====
    this.rootStatus = am5.Root.new('chartStatus');
    this.rootStatus.setThemes([am5themes_Animated.new(this.rootStatus)]);

    const pieChart = this.rootStatus.container.children.push(
      am5percent.PieChart.new(this.rootStatus, {
        layout: this.rootStatus.verticalLayout,
        innerRadius: am5.percent(35),
      })
    );

    const pieSeries = pieChart.series.push(
      am5percent.PieSeries.new(this.rootStatus, {
        name: 'Status',
        valueField: 'value',
        categoryField: 'category',
      })
    );

    pieSeries.slices.template.setAll({
      shadowColor: am5.color(0x000000),
      shadowBlur: 8,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
    });

    pieSeries.data.setAll(this.byStatus());
    pieSeries.appear(900, 80);

    // ===== Columns (daily) =====
    this.rootDaily = am5.Root.new('chartDaily');
    this.rootDaily.setThemes([am5themes_Animated.new(this.rootDaily)]);

    const xyChart = this.rootDaily.container.children.push(
      am5xy.XYChart.new(this.rootDaily, {
        layout: this.rootDaily.verticalLayout,
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
      })
    );

    const xAxis = xyChart.xAxes.push(
      am5xy.CategoryAxis.new(this.rootDaily, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(this.rootDaily, { minGridDistance: 24 }),
      })
    );

    const yAxis = xyChart.yAxes.push(
      am5xy.ValueAxis.new(this.rootDaily, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(this.rootDaily, {}),
      })
    );

    const series = xyChart.series.push(
      am5xy.ColumnSeries.new(this.rootDaily, {
        name: 'Criadas',
        xAxis,
        yAxis,
        valueYField: 'value',
        categoryXField: 'category',
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      shadowColor: am5.color(0x000000),
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      tooltipText: '{categoryX}: {valueY}',
    });

    const data = this.byDay();
    xAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(900);
    xyChart.appear(900, 80);
  }

  private disposeCharts(): void {
    this.rootStatus?.dispose();
    this.rootStatus = undefined;
    this.rootDaily?.dispose();
    this.rootDaily = undefined;
  }

  ngOnDestroy(): void {
    this.disposeCharts();
  }
}
