import { Component, ElementRef, inject, viewChild } from '@angular/core';
// import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
  styleUrl: './trending-page.component.css'
})
export default class TrendingPageComponent {

  // gifs = signal(imageUrls);
  gifService = inject( GifService );

  scrollDivRef = viewChild< ElementRef<HTMLDivElement> >('groupDiv');

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    
    if ( !scrollDiv ) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    console.log({scrollTotal: scrollTop + clientHeight, scrollTop, clientHeight, scrollHeight})
    
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;

    if ( isAtBottom ) {
      this.gifService.loadTrendingGifs();
    }
  }

}
