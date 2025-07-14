import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import type { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse( gifsFromLocalStorage );
  console.log(gifs)
  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>( loadFromLocalStorage() );
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()) );

  constructor() {
    this.loadTrendingGifs();
  }

  
  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify( this.searchHistory() );
    localStorage.setItem(GIF_KEY, historyString);
  })


  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${ environment.giphyURL }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      console.log({gifs})
    })

  }


  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyURL}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      },
    }).pipe(
      map(({data}) => data), 
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap( items => {
        this.searchHistory.update( history => ({
          ...history,
          [ query.toLowerCase() ]: items,
        }))
      }),
    )
  }


  getHistoryGifs( query: string ) {
    return this.searchHistory()[query] ?? [];
  }

}
