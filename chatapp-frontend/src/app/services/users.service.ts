import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/users');
  }

  getUserById(id): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/user/${id}');//?????
  }

  getUserByUsername(username): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/username/${username}'); //???
  }

  followUser(userFollowed): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/follow-user', {userFollowed});
  }

  unFollowUser(userFollowed): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/unfollow-user', {userFollowed});
  }

  markNotification(id, deleteVal?): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/mark/${id}', {id, deleteVal});
  }

  markAllNotifications(): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/mark-all', {
      all: true
    });
  }

  addImage(image): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/upload-image}', {image});
  }

  setDefaultImage(imageId, imageVersion): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/set-default-image/${imageId}/${imageVersion}');//?????
  }

  profileNotifications(id): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/user/view-profile', id)
  }

  changePassword(body): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/change-password', body)
  }
}
