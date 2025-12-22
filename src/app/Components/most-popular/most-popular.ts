import { Component, ViewChild } from '@angular/core';
import { Topic } from '../../Models/topic';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';

@Component({
  selector: 'app-most-popular',
  imports: [Carousel, ButtonModule,CardModule,FormsModule, Rating],
  templateUrl: './most-popular.html',
  styleUrl: './most-popular.css',
})
export class MostPopular {
   responsiveOptions: any[] | undefined;

    topics!:Topic [] ;

      value: number = 3;
      // selectedCourse: any;
      // @ViewChild('op') OP!:OverlayPanel;

      constructor() {}//private topicService: TopicService) {}

      ngOnInit() {
          // this.topicService.getProductsSmall().then((topics) => {
          //     this.topics = topics;
          // });
           this.topics = [
              {
                   id: '1000',
                      code: 'f230fh0g3',
                      name: 'Bamboo Watch',
                      description: 'Product Description',
                      image: 'bamboo-watch.jpg',
                      price: 65,
                      category: 'Accessories',
                      quantity: 24,
                      inventoryStatus: 'INSTOCK',
                      rating: 5
              },
               {
                   id: '1000',
                      code: 'f230fh0g3',
                      name: 'Bamboo Watch',
                      description: 'Product Description',
                      image: 'bamboo-watch.jpg',
                      price: 65,
                      category: 'Accessories',
                      quantity: 24,
                      inventoryStatus: 'INSTOCK',
                      rating: 5
              },
               {
                   id: '1000',
                      code: 'f230fh0g3',
                      name: 'Bamboo Watch',
                      description: 'Product Description',
                      image: 'bamboo-watch.jpg',
                      price: 65,
                      category: 'Accessories',
                      quantity: 24,
                      inventoryStatus: 'INSTOCK',
                      rating: 5
              },
               {
                   id: '1000',
                      code: 'f230fh0g3',
                      name: 'Bamboo Watch',
                      description: 'Product Description',
                      image: 'bamboo-watch.jpg',
                      price: 65,
                      category: 'Accessories',
                      quantity: 24,
                      inventoryStatus: 'INSTOCK',
                      rating: 5
              },
              {
                   id: '1000',
                      code: 'f230fh0g3',
                      name: 'Bamboo Watch',
                      description: 'Product Description',
                      image: 'bamboo-watch.jpg',
                      price: 65,
                      category: 'Accessories',
                      quantity: 24,
                      inventoryStatus: 'INSTOCK',
                      rating: 5
              },

              {
                   id: '1000',
                      code: 'f230fh0g3',
                      name: 'Bamboo Watch',
                      description: 'Product Description',
                      image: 'bamboo-watch.jpg',
                      price: 65,
                      category: 'Accessories',
                      quantity: 24,
                      inventoryStatus: 'INSTOCK',
                      rating: 5
              },
              {
                   id: '1000',
                      code: 'f230fh0g3',
                      name: 'Bamboo Watch',
                      description: 'Product Description',
                      image: 'bamboo-watch.jpg',
                      price: 65,
                      category: 'Accessories',
                      quantity: 24,
                      inventoryStatus: 'INSTOCK',
                      rating: 5
              }
            ]

          this.responsiveOptions = [
              {
                  breakpoint: '1400px',
                  numVisible: 2,
                  numScroll: 1,
              },
              {
                  breakpoint: '1199px',
                  numVisible: 3,
                  numScroll: 1,
              },
              {
                  breakpoint: '767px',
                  numVisible: 2,
                  numScroll: 1,
              },
              {
                  breakpoint: '575px',
                  numVisible: 1,
                  numScroll: 1,
              }
          ];
      }

      // getSeverity(status: string) {
      //     switch (status) {
      //         case 'INSTOCK':
      //             return 'success';
      //         case 'LOWSTOCK':
      //             return 'warn';
      //         case 'OUTOFSTOCK':
      //             return 'danger';
      //     }
      // }
  

}
