import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import type { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { finalize, map, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse( gifsFromLocalStorage );
  
  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    
    for ( let i = 0; i < this.trendingGifs().length; i += 3) {
        groups.push( this.trendingGifs().slice(i, i + 3) );
    }

    return groups;
  });

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
    if ( this.trendingGifsLoading() ) return;

    this.trendingGifsLoading.set( true );

    const endpoint = `${ environment.giphyURL }/gifs/trending`;
    const offset = this.trendingPage() * 20;
    const params = {
      api_key: environment.giphyApiKey,
      limit: 20,
      offset,
    }

    this.http.get<GiphyResponse>(endpoint, { params })
      .pipe(
        map(resp => GifMapper.mapGiphyItemsToGifArray(resp.data)),
        finalize(() => this.trendingGifsLoading.set(false))
      )
      .subscribe({
        next: (gifs) => {
          this.trendingGifs.update(current => [...current, ...gifs]);
          this.trendingPage.update(page => page + 1);
        },
        error: (err) => {
          console.error('Failed to load trending GIFs', err)
        }
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
