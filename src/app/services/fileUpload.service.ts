import { HttpClient, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FileUploadProgress {
  progress: number;
  loaded: number;
  total: number;
  state: 'uploading' | 'done';
  response?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://api-thinktech.vercel.app';

  uploadFile(
    file: File, 
    additionalData?: Record<string, string>
  ): Observable<FileUploadProgress> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.post<any>(`${this.API_URL}/file`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          return {
            progress: event.total ? Math.round(100 * event.loaded / event.total) : 0,
            loaded: event.loaded,
            total: event.total || 0,
            state: 'uploading' as const
          };
        } else if (event.type === HttpEventType.Response) {
          return {
            progress: 100,
            loaded: event.body?.size || 0,
            total: event.body?.size || 0,
            state: 'done' as const,
            response: event.body as any
          };
        }
        return {
          progress: 0,
          loaded: 0,
          total: 0,
          state: 'uploading' as const
        };
      })
    );
  }

  deleteFile(fileId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.API_URL}/files/${fileId}`
    );
  }
}