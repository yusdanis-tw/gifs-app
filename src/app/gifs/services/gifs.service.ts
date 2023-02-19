import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interfaces'

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private servicioUrl = 'https://api.giphy.com/v1/gifs'
  private limit = 10
  private apiKey = 'No0OXHn53oIJgRTCXkh96YUOFoYuZ3D8'
  private _historial: string[] = []
  public resutados: Gif[] = []

  get historial(): string[] {
    return [...this._historial]
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
    this.resutados = JSON.parse(localStorage.getItem('resultados')!) || []
  }

  buscarGifs(query: string = '') {
    query = query.toLocaleLowerCase()

    if (!this._historial.includes(query)) {
      this._historial.unshift(query)
      this._historial = this._historial.splice(0, 10)
      localStorage.setItem('historial', JSON.stringify(this._historial))
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', this.limit)
      .set('q', query)

    this.http
      .get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((resp) => {
        this.resutados = resp.data
        localStorage.setItem('resultados', JSON.stringify(this.resutados))
      })
  }
}
