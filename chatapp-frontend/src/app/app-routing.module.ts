import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: './components/auth-tabs/auth.module#AuthModule'
  },
  {
    path: 'streams',
    loadChildren: './components/streams/streams.module#StreamsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    loadChildren: './components/people/people.module#PeopleModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'people/following',
    loadChildren: './components/following/following.module#FollowingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'people/followers',
    loadChildren: './components/followers/followers.module#FollowersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'people/:id',
    loadChildren: './components/comments/comments.module#CommentsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: './components/notifications/notifications.module#NotificationsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'chat/:name',
    loadChildren: './components/chat/chat.module#ChatModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
