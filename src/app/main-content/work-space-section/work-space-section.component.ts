import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { UserCardComponent } from '../user-card/user-card.component';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelSectionComponent } from '../create-channel-section/create-channel-section.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../../models/user.class';
import { Allchannels } from '../../../models/allchannels.class';

@Component({
  selector: 'app-work-space-section',
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIcon,
    MatExpansionModule,
    MatAccordion,
    MatInputModule,
    NgFor,
    AsyncPipe,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './work-space-section.component.html',
  styleUrl: './work-space-section.component.scss',
})
export class WorkSpaceSectionComponent implements OnInit {

  dataUser = inject(UserService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  unsubChannels!: Subscription;
  newChannel = new Allchannels();
  isDrawerOpen = false;
  selectedUser: any;
  urlUserId!: string;
  users$: Observable<User[]> | undefined;
  myPanel: any = true;

  /* dialog = inject(MatDialog); */

  accordion = viewChild.required(MatAccordion);
  activeChannelId!: string;

onChange(user: any){

  console.log(user);
}

   ngOnInit(): void {
    this.users$ = this.dataUser.getAllUsers();
    this.dataUser.showCurrentUserData();
    console.log('user storage id', this.dataUser.currentChannelId);
    this.unsubChannels = this.dataUser.channelsLoaded$.subscribe(loaded => {
      if (loaded) {
        console.log('channel route', this.dataUser.userSubcollectionId);
        this.loadSaveRoute();
      }
    });
  }

  toggleDrawer(drawer: MatDrawer) {
    this.isDrawerOpen = !this.isDrawerOpen;
    drawer.toggle();
  }

  onUserClick(index: number, user: any) {
    this.selectedUser = user;
    this.dataUser.setCheckdValue(user);
  }

  readonly dialog = inject(MatDialog);

  createChannel() {
    this.dialog.open(CreateChannelSectionComponent, {
      width: '872px',
      height: '539px',
      maxWidth: '872px',
      maxHeight: '539px',
      panelClass: 'channel-dialog-container',
    });
  }

  loadSaveRoute() {
    const channelId = this.dataUser.userSubcollectionId;
    if (channelId) {
      this.router.navigate(['mainpage', this.dataUser.currentUserId, 'channel', channelId,]); 
    } else {
      this.router.navigate(['mainpage', this.dataUser.currentUserId]);
    }
  }

  openChannel(channelName: string, channelId: string, channelDescription: string) {
    this.router.navigate(['mainpage', this.dataUser.currentUserId, 'channel', channelId,]);
    this.newChannel.channelname = channelName;
    this.newChannel.channelId = channelId;
    this.newChannel.description = channelDescription;
    this.getChannelNameandId(channelName, channelId, channelDescription);
    this.dataUser.updateUserStorage(this.dataUser.currentUserId, this.dataUser.userSubcollectionId, this.newChannel.toJSON())
  }

  getChannelNameandId(channelName: string, channelId: string, channelDescription: string) {
    this.activeChannelId = channelId;
    console.log('Aktiver Channel:', this.activeChannelId);
    this.dataUser.currentChannelId = channelId;
    this.dataUser.currentChannelName = channelName;
    this.dataUser.currentChannelDescription = channelDescription;
    this.dataUser.getChannelUserId(this.activeChannelId);
  }

  ngOnDestroy(): void {
    this.unsubChannels.unsubscribe();
  }
}