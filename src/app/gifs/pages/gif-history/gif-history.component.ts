import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gif-history',
  imports: [],
  templateUrl: './gif-history.component.html',
  styleUrl: './gif-history.component.css',
})
export default class GifHistoryComponent {

  // query = inject(ActivatedRoute).params.subscribe( params => {
  //     console.log({params});
  // });

  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map( params => params['query'] )
    )
  );

}
