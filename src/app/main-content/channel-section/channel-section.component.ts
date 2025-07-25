import { Component, inject, Injector, OnInit } from '@angular/core';
import { User } from '../../../models/user.class';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { getDoc, onSnapshot } from '@angular/fire/firestore';
import { Allchannels } from '../../../models/allchannels.class';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-channel-section',
  imports: [MatCardModule, MatIcon, MatButtonModule, MatDividerModule, CommonModule, FormsModule],
  templateUrl: './channel-section.component.html',
  styleUrl: './channel-section.component.scss'
})
export class ChannelSectionComponent implements OnInit {

  dialogRef = inject(MatDialogRef<ChannelSectionComponent>);
  dataUser = inject(UserService);
  channelService = inject(ChannelService);

  showEditChannelName = false;
  showEditChannelDescription = false;
  showChannels = false;

  newChannel = new Allchannels();

   ngOnInit(): void {
    
  }

  editChannelName() {
    this.showEditChannelName = true;
    let baseName = this.channelService.currentChannelName ? this.dataUser.channelService.currentChannelName : this.channelService.userSubcollectionChannelName;
    this.newChannel.channelname = '# ' + baseName;
  }

  saveEditedChannelName() {
    this.showEditChannelName = false;
    if(!this.channelService.currentChannelId) {
      this.channelService.currentChannelId = this.channelService.userSubcollectionChannelId;
    }
    this.newChannel.channelId = this.channelService.currentChannelId;
    const cleaned = this.newChannel.channelname.replace(/^#\s*/, '').trim();
    this.newChannel.channelname = cleaned;
    this.channelService.editChannel(this.channelService.currentChannelId, this.newChannel.toJSON(['channelId','channelname'])).then(() => {
    this.channelService.updateUserStorage(this.channelService.currentUserId, this.channelService.userSubcollectionId, this.newChannel.toJSON(['channelId','channelname']));
    this.channelService.currentChannelName = cleaned;
    this.channelService.checkChannel();
    });
  }

  editChannelDescription() {
    this.showEditChannelDescription = true;
    let baseDescription = this.channelService.currentChannelDescription ? this.channelService.currentChannelDescription : this.channelService.userSubcollectionDescription;
    this.newChannel.description = baseDescription;
  }

  saveEditedChannelDescription() {
    this.showEditChannelDescription = false;
    if(!this.channelService.currentChannelId) {
      this.channelService.currentChannelId = this.channelService.userSubcollectionChannelId;
    }
    this.channelService.editChannel(this.channelService.currentChannelId, this.newChannel.toJSON(['description'])).then(() => {
    this.channelService.updateUserStorage(this.channelService.currentUserId, this.channelService.userSubcollectionId, this.newChannel.toJSON(['description']));
    this.channelService.currentChannelDescription = this.newChannel.description ?? '';
    });
  }

  // updateChannelListUser(channelName: string, channelId: string) {
  //   const updatedChannel = {
  //   channelId: channelId, 
  //   channelname: channelName                   
  // };
  //   const index = this.dataUser.showChannelByUser.findIndex(ch => ch.channelId === updatedChannel.channelId);
  //   if (index !== -1) {
  //   this.dataUser.showChannelByUser[index] = updatedChannel;
  //   }
  // }

  // async loadChannelCreatorData() {
  // await this.dataUser.getChannelUserName();
  // }

}