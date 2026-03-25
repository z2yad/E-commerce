import { Injectable, Inject, DOCUMENT } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private baseTitle = 'Premium E-Commerce Store';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  /**
   * Updates standard SEO meta tags
   */
  updateSeo(config: { title?: string; description?: string; image?: string; url?: string }) {
    // 1. Title
    const finalTitle = config.title ? `${config.title} | ${this.baseTitle}` : this.baseTitle;
    this.titleService.setTitle(finalTitle);

    // 2. Meta Description
    if (config.description) {
      this.metaService.updateTag({ name: 'description', content: config.description });
      this.metaService.updateTag({ property: 'og:description', content: config.description });
      this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    }

    // 3. Open Graph & Twitter Summary Cards
    this.metaService.updateTag({ property: 'og:title', content: finalTitle });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: finalTitle });

    // 4. Social Image
    if (config.image) {
      this.metaService.updateTag({ property: 'og:image', content: config.image });
      this.metaService.updateTag({ name: 'twitter:image', content: config.image });
    }

    // 5. URL Canonical
    if (config.url) {
      this.metaService.updateTag({ property: 'og:url', content: config.url });
      this.updateCanonicalUrl(config.url);
    }
  }

  /**
   * Updates the canonical URL tag in the document head
   */
  private updateCanonicalUrl(url: string) {
    const head = this.doc.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = this.doc.querySelector(`link[rel='canonical']`) || null;
    if (!element) {
      element = this.doc.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    element.setAttribute('href', url);
  }
}
