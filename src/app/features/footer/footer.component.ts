import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  navigate(socialNetwork: string): void {
    const urls: Record<string, string> = {
      instagram: 'https://www.instagram.com/',
      twitter: 'https://www.twitter.com/',
      facebook: 'https://www.facebook.com/',
    };

    const url = urls[socialNetwork];
    if (url) {
      window.open(url, '_blank');
    }
  }
}
