import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from '../../components/gif-list/gif-list.component';

@Component({
  selector: 'app-gif-history',
  imports: [ GifListComponent ],
  templateUrl: './gif-history.component.html',
  styleUrl: './gif-history.component.css',
})
export default class GifHistoryComponent {

  // query = inject(ActivatedRoute).params.subscribe( params => {
  //     console.log({params});
  // });

  gifService = inject(GifService);

  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map( params => params['query'] )
    )
  );

  gifsByKey = computed(() => {
    return this.gifService.getHistoryGifs( this.query() )
  })
}
