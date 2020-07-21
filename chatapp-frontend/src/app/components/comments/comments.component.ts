import { Component, OnInit, AfterViewInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment';
import _ from 'lodash';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any //the id of the post which the comment is added into
  socket: any;
  post: String;
  commentArr=[]; //comments array

  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) {
      this.socket = io('http://localhost:3000');// connect to server
   }

  ngOnInit(): void {
    this.toolbarElement = document.querySelector('.nav-content');
    this.init();
    this.postId = this.route.snapshot.paramMap.get('id');

    this.getPost();

    //refresh the comment component
    this.socket.on('refreshPage', data => {
      this.getPost();
    });
  }

  init(){
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }
  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none'; 
  }

  addComment() {
    //call the addComment method of the post Service
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      this.socket.emit('refresh', {}); //send a refresh event to server
      this.commentForm.reset();
    });
  }

  //get the comments of the post
  getPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      console.log(data);                                                                                                               BB
      this.post = data.post.post;
      this.commentArr=data.post.comment.reverse();
    });
  }
  TimeFromNow(time){
    return moment(time).fromNow();
  }
}
                                                                   