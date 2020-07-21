import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  addPost(body): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/post/add-post', body);
  }

  getAllPosts(): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/posts');
  }

  likePost(body): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/add-like', body);
  }

  addComment(comment, postId): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/add-comment', comment, postId);
  }

  getPost(id): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/post/${id}');
  }

  editPost(body): Observable<any> {
    return this.http.put('http://localhost:3000/api/chatapp/post/edit-post', body);
  }

  deletePost(id): Observable<any> {
    return this.http.delete('http://localhost:3000/api/chatapp/post/delete-post/${id}');
  }

}
