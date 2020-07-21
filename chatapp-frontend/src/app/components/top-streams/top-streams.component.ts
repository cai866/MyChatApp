import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import {lodash} from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { _ParseAST } from '@angular/compiler';
import { Router } from '@angular/router';


@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  socket: any;
  user: any;
  constructor(private postService: PostService, private tokenService: TokenService, private router: Router) {              
    this.socket = io('http://localhost:3000');// connect to server
  }
  topPosts = [];
  ngOnInit(): void {
    this.user = this.tokenService.GetPayload(); //get the user of the post component
    //init the post component
    this.getPosts();
    //refresh the post component
    this.socket.on('refreshPage', data => {
      this.getPosts();
    });
  }

  getPosts(){
    this.postService.getAllPosts().subscribe(
      data =>{
      this.topPosts = data.topPosts;
      },
      err => {
        //if token expired, user will logout automatically
        if(err.error.token === null) {
          this.tokenService.DeleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }
  //return the time from creating post  upto now
  TimeFromNow(time){
    return moment(time).fromNow();
  }

  //call a likePost service
  likePost(post){
    this.postService.likePost(post).subscribe(
      data =>{
        console.log(data);
        this.socket.emit('refresh', {}); //send a refresh event to server
      },
      err => console.log(err)
    );
  }

  checkInLikesArray(arr, username){
      return _.some(arr, {username:username});
  }

  openCommentBox(post){
    this.router.navigate(['post', post._id]);//create a new route called 'post'
  }
}


