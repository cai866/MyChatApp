import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  tabElement: any;
  postsTab = false;
  followingTab = false;
  followersTab = false;
  posts: [];
  followers: [];
  following: [];
  user: any;
  name: any;
  postValue: any;
  editForm: FormGroup;
  modalElement: any;
  socket: any;

  constructor(private userService: UsersService, private route: ActivatedRouted, private postService: PostService, private fb: FormBuilder) {
      this.socket = io('http://localhost:3000');// connect to server
   }

  ngOnInit(): void {
    this.postsTab = true;
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs,{});
    this.tabElement = document.querySelector('.nav-content');

    this.modalElement = document.querySelector('.modal');
    M.Modal.init(this.modalElement, {});

    this.route.params.subscribe(params => {
      this.name = params.name;
      this.getUserData(this.name);
    });

    this.InitEditForm();
    
  }

  ngAfterViewInit() {
    this.tabElement.style.display = 'none';
  }

  InitEditForm() {
    this.editForm = this.fb.group({
      editedPost: ['', Validators.required]
    });
  }

  changeTab(value) {
    if(value === 'posts') {
      this.postsTab = true;
      this.followersTab = false;
      this.followingTab = false;
    }

    if(value === 'following') {
      this.postsTab = false;
      this.followersTab = false;
      this.followingTab = true;
    }

    if(value === 'followers') {
      this.postsTab = false;
      this.followersTab = true;
      this.followingTab = false;
    }
  }

  OpenEditModal(post) {

  }

  
  SubmitEditedPost() {
    const body = {
      id: this.postValue.postId._id,
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


  CloseModal() {
    M.Modal.getInstance(this.modalElement).close();
  }

  deletePost() {
    
    this.postService.deletePost(this.postValue.postId._id).subscribe(data => {
      console.log(data)
      this.socket.emit('refresh', {});
    }, 
    err => console.log(err)
    );

  }

  getUserData(name) {
    this.userService.getUserByUsername(name) .subscribe(
      data => {
        this.user = data.result;
        this.posts = data.result.posts.reverse();
        this.followers = data.result.followers;
        this.following = data.result.following;
      },
      err => console.log(err)
    );
  }

   //return the time from creating post  upto now
   TimeFromNow(time){
    return moment(time).fromNow();
  }

}
