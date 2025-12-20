import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../Services/category-service';
import { Category } from '../../../Models/category';
import { SubCategory } from '../../../Models/sub-category';
import { Topic } from '../../../Models/topic';

@Component({
  selector: 'app-explore-menu',
  imports: [CommonModule],
  templateUrl: './explore-menu.html',
  styleUrl: './explore-menu.css',
})
export class ExploreMenu implements OnInit {
  isOpen = false;
  categories!: Category[];
  subCategories!: SubCategory[]|null;
  topics!: Topic[] ;
  activeCategoryId: number | null = null;
  activeSubCategoryId: number | null = null;

  activeMenuStatic:string |null=null;
  activeSubMenuStatic:string |null=null;



  constructor(private catService:CategoryService  ,private cdr: ChangeDetectorRef){
   this.catService.getCategories().subscribe((data)=>{
      this.categories=data
    });
  }
  ngOnInit(): void {
    this.catService.getCategories().subscribe((data)=>{
      this.categories=data
    });
  }


 subMenusStatic:any = {
  ai: [
    { key: 'aifun', label: 'AI Fundementals' },
    { key: 'aipro', label: 'AI Professionals' },
    { key: 'aidev', label: 'AI For Developers' },
    { key: 'aicreat', label: 'AI For Creatives' }


  ],
  career: [
    { key: 'management', label: 'Management' },
    { key: 'sales', label: 'Sales' }
  ],
  certificate: [
    { key: 'security', label: 'Cyber Security' },
    { key: 'network', label: 'Networking' }
  ]
};
topicsStatics:any = {
  aifun: ['Prompt Engineering', 'Larg Language Models(LLM)', 'Generative AI(GenAI)', 'AI Agents & Agentic AI'],
  aipro: ['ChatGPT', 'Microsoft Copilot', 'Google Gemini (Bard)','Claude AI','AI Content Generation','Perplexity AI','Agentforce','DeepSeek','MLOps','TensorFlow','PyTorch'],
  aidev: ['OpenAI API', 'GitHub Copilot','Azure Machine Learning','Retrieval Augmented Generation','LangChain','MLOps','TensortFlow','PyTorch'],
  aicreat: ['DALLE', 'Midjourney','Stable Diffusion','Leonardo.Ai','AI Art Generation'],
  sales: ['B2B Sales', 'Negotiation'],
  security: ['Ethical Hacking', 'Pen Testing'],
  network: ['CCNA', 'Routing & Switching']
};


setActiveStatic(menu: string) {
  this.activeMenuStatic = menu;
  this.activeSubMenuStatic = null;
  this.subCategories=null;
}
setSubActiveStatic(menu: string) {
  this.activeSubMenuStatic = menu;
//this.subCategories=null;
}

openMenu() {
  this.isOpen = true;
}

closeMenu() {
  this.isOpen = false;

}

onCategoryHover(categoryId: number) {
if (this.activeCategoryId === categoryId) return;
    this.activeMenuStatic=null
    this.activeSubMenuStatic=null
    this.activeCategoryId = categoryId;
    this.activeSubCategoryId = null;
    this.topics = [];
    this.catService.getSubCategories(categoryId)
      .subscribe(data => {
        this.subCategories = data;
        this.cdr.detectChanges();
        console.log(this.subCategories)
      });
  }
  onleave(){
    this.subCategories=null
  }

  onSubCategoryHover(subId: number) {
    if (this.activeSubCategoryId === subId) return;

    this.activeSubCategoryId = subId;

    // this.catService.getSubCategories(subId)
    //   .subscribe((data) => {
    //     this.topics = data;
    //   });
  }
}
