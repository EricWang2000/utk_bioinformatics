import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = 'http://localhost:8000';  // Django API URL

  constructor(private http: HttpClient) {}

  // Helper method to get the CSRF token from cookies
  getCsrfToken(): string | null {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  // Upload the file and form data to the backend
  uploadFile(formData: FormData): Observable<any> {
    const csrfToken = this.getCsrfToken();  // Get the CSRF token from the cookies
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken || '',  // Add CSRF token to the headers
    });

    // Send formData as POST request
    return this.http.post(`${this.baseUrl}/add/`, formData, {
      headers,
      responseType: 'json',  // Since Django renders HTML, expect 'text' response
    });
  }

  // Download file
  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${filename}`, {
      responseType: 'blob', // Ensures the response is treated as a file
    });
  }
  // View file
  viewFile(filename: string) {
    return this.http.get(`${this.baseUrl}/${filename}`);
  }

  viewPage(name: string) {
    return this.http.get(`${this.baseUrl}/name=${name}`);
  }
}
