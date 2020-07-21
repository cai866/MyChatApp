import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ChatComponent } from './chat.component';
import { MessageComponent} from './../message/message.component';
import { EmojiPickerModule } from 'ng2-emoji-picker';
@NgModule({
  declarations: [ChatComponent, MessageComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    EmojiPickerModule.forRoot()
  ]
})
export class ChatModule { }
