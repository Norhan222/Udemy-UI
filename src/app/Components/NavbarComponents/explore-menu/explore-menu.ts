import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../Services/category-service';
import { Category } from '../../../Models/category';
import { SubCategory } from '../../../Models/sub-category';
import { Topic } from '../../../Models/topic';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-explore-menu',
  imports: [CommonModule, TranslateModule],
  templateUrl: './explore-menu.html',
  styleUrl: './explore-menu.css',
})
export class ExploreMenu implements OnInit, OnChanges {
  isOpen = false;
  categories: Category[] = [];
  subCategories!: SubCategory[] | null;
  topics: Topic[] = [];
  activeCategoryId: number | null = null;
  activeSubCategoryId: number | null = null;

  activeMenuStatic: string | null = null;
  activeSubMenuStatic: string | null = null;



  constructor(private catService: CategoryService, private cdr: ChangeDetectorRef, private translate: TranslateService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.catService.getCategories().subscribe((data) => {
      this.categories = data
    });
  }
  ngOnInit(): void {
    this.catService.getCategories().subscribe((data) => {
      this.categories = data
    });

    // Apply RTL positioning if needed
    this.applyRTLPositioning();
  }

  applyRTLPositioning(): void {
    const isRTL = document.documentElement.dir === 'rtl';
    if (isRTL) {
      // Force RTL positioning via JavaScript
      setTimeout(() => {
        const dropdown = document.querySelector('.explore-dropdown') as HTMLElement;
        if (dropdown) {
          dropdown.style.left = 'auto';
          dropdown.style.right = '0';
        }
      }, 100);
    }
  }


  subMenusStatic: any = {
    ai: [
      { key: 'aifun', label: 'EXPLORE.SUB_MENU.AI_FUNDAMENTALS' },
      { key: 'aipro', label: 'EXPLORE.SUB_MENU.AI_PROFESSIONALS' },
      { key: 'aidev', label: 'EXPLORE.SUB_MENU.AI_FOR_DEVS' },
      { key: 'aicreat', label: 'EXPLORE.SUB_MENU.AI_FOR_CREATIVES' }
    ],
    career: [
      { key: 'management', label: 'EXPLORE.SUB_MENU.MANAGEMENT' },
      { key: 'sales', label: 'EXPLORE.SUB_MENU.SALES' }
    ],
    certificate: [
      { key: 'security', label: 'EXPLORE.SUB_MENU.CYBER_SECURITY' },
      { key: 'network', label: 'EXPLORE.SUB_MENU.NETWORKING' }
    ]
  };
  topicsStatics: any = {
    aifun: ['EXPLORE.TOPICS.PROMPT_ENG', 'EXPLORE.TOPICS.LLM', 'EXPLORE.TOPICS.GEN_AI', 'EXPLORE.TOPICS.AI_AGENTS'],
    aipro: ['EXPLORE.TOPICS.CHATGPT', 'EXPLORE.TOPICS.COPILOT', 'EXPLORE.TOPICS.GEMINI', 'EXPLORE.TOPICS.CLAUDE', 'EXPLORE.TOPICS.AI_CONTENT', 'EXPLORE.TOPICS.PERPLEXITY', 'EXPLORE.TOPICS.AGENTFORCE', 'EXPLORE.TOPICS.DEEPSEEK', 'EXPLORE.TOPICS.MLOPS', 'EXPLORE.TOPICS.TENSORFLOW', 'EXPLORE.TOPICS.PYTORCH'],
    aidev: ['EXPLORE.TOPICS.OPENAI_API', 'EXPLORE.TOPICS.GITHUB_COPILOT', 'EXPLORE.TOPICS.AZURE_ML', 'EXPLORE.TOPICS.RAG', 'EXPLORE.TOPICS.LANGCHAIN', 'EXPLORE.TOPICS.MLOPS', 'EXPLORE.TOPICS.TENSORFLOW', 'EXPLORE.TOPICS.PYTORCH'],
    aicreat: ['EXPLORE.TOPICS.DALLE', 'EXPLORE.TOPICS.MIDJOURNEY', 'EXPLORE.TOPICS.STABLE_DIFFUSION', 'EXPLORE.TOPICS.LEONARDO', 'EXPLORE.TOPICS.AI_ART'],
    sales: ['EXPLORE.TOPICS.B2B_SALES', 'EXPLORE.TOPICS.NEGOTIATION'],
    security: ['EXPLORE.TOPICS.ETHICAL_HACKING', 'EXPLORE.TOPICS.PEN_TESTING'],
    network: ['EXPLORE.TOPICS.CCNA', 'EXPLORE.TOPICS.ROUTING_SWITCHING']
  };


  setActiveStatic(menu: string) {
    this.activeMenuStatic = menu;
    this.activeSubMenuStatic = null;
    this.subCategories = null;
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
    // Reset all states when closing
    this.activeMenuStatic = null;
    this.activeSubMenuStatic = null;
    this.activeCategoryId = null;
    this.activeSubCategoryId = null;
    this.subCategories = null;
    this.topics = [];
  }

  getDropdownStyle() {
    const isRTL = document.documentElement.dir === 'rtl';
    if (isRTL) {
      return {
        'left': 'auto',
        'right': '0'
      };
    }
    return {};
  }

  onCategoryHover(categoryId: number) {
    if (this.activeCategoryId === categoryId) return;
    this.activeMenuStatic = null
    this.activeSubMenuStatic = null
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
  onleave() {
    this.subCategories = null
  }

  onSubCategoryHover(subId: number) {
    if (this.activeSubCategoryId === subId) return;

    this.activeSubCategoryId = subId;

    // this.catService.getSubCategories(subId)
    //   .subscribe((data) => {
    //     this.topics = data;
    //   });
  }
  getName(item: any): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    return lang === 'ar' ? (item.nameAR || item.nameEN) : (item.nameEN || item.nameAR);
  }

  getArrowIcon(): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    return lang === 'ar' ? 'bi bi-chevron-left' : 'bi bi-chevron-right';
  }
}
