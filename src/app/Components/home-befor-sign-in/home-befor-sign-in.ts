import { Component } from '@angular/core';
import { TechnicalTopics } from '../technical-topics/technical-topics';
import { TopicsCarousel } from '../topics-carousel/topics-carousel';
import { OurpPlans } from '../ourp-plans/ourp-plans';

@Component({
  selector: 'app-home-befor-sign-in',
  imports: [TechnicalTopics,TopicsCarousel,OurpPlans  ],
  templateUrl: './home-befor-sign-in.html',
  styleUrl: './home-befor-sign-in.css',
})
export class HomeBeforSignIn {

}
