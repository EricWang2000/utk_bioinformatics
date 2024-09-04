import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = 'http://localhost:8000/fileapp'; // Flask API URL

  constructor(private http: HttpClient) {}

  // Upload file
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  // Download file
  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${filename}`, {
      responseType: 'blob', // Ensures the response is treated as a file
    });
  }
}
