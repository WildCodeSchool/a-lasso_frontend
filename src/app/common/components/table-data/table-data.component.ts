import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column, TableData } from '../../models/table-data';

@Component({
  selector: 'app-table-data',
  imports: [TableModule],
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss',
})
export class TableDataComponent {
  @Input() cols!: Column[];
  @Input() data!: TableData[];
}
