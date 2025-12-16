import { Component } from '@angular/core';
import { Topic } from '../../Models/topic';
import { ButtonModule } from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topics-recommended',
  imports: [Carousel, ButtonModule,CommonModule],
  templateUrl: './topics-recommended.html',
  styleUrl: './topics-recommended.css',
})
export class TopicsRecommended {
    
    topics!:Topic [] ;
    topicsName!:string [] ;
  
     topicGroups: string[][] = [];
  
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


        for (let i = 0; i < this.topics.length; i += 2) {
          this.topicGroups.push([
                this.topics[i].name,
                this.topics[i + 1]?.name
          ]);
      }
  
         
          
      }

      

}
