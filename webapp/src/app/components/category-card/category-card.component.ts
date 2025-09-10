import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import type { Category } from '../../types/category';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
  imports: [MatIconModule, CommonModule]
})
export class CategoryCardComponent {
  @Input() category!: Category;
  @Input() onClick: (categoryId: string) => void = () => {};
}
