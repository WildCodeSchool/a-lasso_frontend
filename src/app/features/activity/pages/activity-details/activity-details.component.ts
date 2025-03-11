import { Component, inject, OnInit } from '@angular/core';
import { AssociationCardComponent } from '../../../association/components/association-card/association-card.component';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-activity-details',
  imports: [AssociationCardComponent],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  activityId!: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.activityId = String(params.get('id'));
    });
  }
}
