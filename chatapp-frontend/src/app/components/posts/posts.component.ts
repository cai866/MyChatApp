import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import {lodash} from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { _ParseAST } from '@angular/compiler';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import * as M from 'materialize-css';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  socket: any;
  user: any;
  editForm: FormGroup;
  modalElement: any;
  postValue: any;

  constructor(private postService: PostService, private tokenService: TokenService, private router: Router, private fb: FormBuilder) {              
    this.socket = io('http://localhost:3000');// connect to server
  }
  posts = [];

  ngOnInit(): void {
    this.modalElement = document.querySelector('.modal');
    M.Modal.init(this.modalElement, {});

    this.user = this.tokenService.GetPayload(); //get the user of the post component
    //init the post component
    this.getPosts();
    //refresh the post component
    this.socket.on('refreshPage', data => {
      this.getPosts();
    });

    this.InitEditForm();
  }

  InitEditForm() {
    this.editForm = this.fb.group({
      editedPost: ['', Validators.required]
    });
  }

  getPosts(){
    this.postService.getAllPosts().subscribe(
      data =>{
      this.posts = data.posts;
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

  SubmitEditedPost() {
    const body = {
      id: this.postValue._id,
      post: this.editForm.value.editedPost
    }
    this.postService.editPost(body).subscribe(data => {
      console.log(data)
      this.socket.emit('refresh', {});
    }, 
    err => console.log(err)
    );

    M.Modal.getInstance(this.modalElement).close();
    this.editForm.reset();
  }

  OpenEditModal(post) {
    this.postValue = post;
  }

  CloseModal() {
    M.Modal.getInstance(this.modalElement).close();
  }

  deletePost() {
    
    this.postService.deletePost(this.postValue._id).subscribe(data => {
      console.log(data)
      this.socket.emit('refresh', {});
    }, 
    err => console.log(err)
    );

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
