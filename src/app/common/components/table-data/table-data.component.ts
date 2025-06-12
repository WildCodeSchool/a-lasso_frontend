import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  @Output() rowClickHandler: EventEmitter<TableData> = new EventEmitter<TableData>();

  selectedRow: TableData;

  handleRowClick(row: TableData): void {
    if (this.rowClickHandler) {
      this.rowClickHandler.emit(row);
      this.selectedRow = row;
    }
  }
}
