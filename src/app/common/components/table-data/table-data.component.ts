import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column, TableData } from '../../models/table-data';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-table-data',
  imports: [TableModule, NgClass],
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss',
})
export class TableDataComponent {
  @Input() cols!: Column[];
  @Input() data!: TableData[];

  @Input() rowClickHandler?: (row: TableData) => void;

  selectedRow: TableData;

  handleRowClick(row: TableData): void {
    if (this.rowClickHandler) {
      this.rowClickHandler(row);
      this.selectedRow = row;
    }
  }
}
