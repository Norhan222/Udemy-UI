import { Component } from '@angular/core';
import { OurpPlans } from '../ourp-plans/ourp-plans';
import { TechnicalTopics } from '../technical-topics/technical-topics';
import { TopicsCarousel } from '../topics-carousel/topics-carousel';
@Component({
  selector: 'app-home-befor-sign-in',
  imports: [TechnicalTopics,TopicsCarousel,OurpPlans  ],
  templateUrl: './home-befor-sign-in.html',
  styleUrl: './home-befor-sign-in.css',
})
export class HomeBeforSignIn {

}
