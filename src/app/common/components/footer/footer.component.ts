import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [RouterLink],
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
