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
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { UserCardComponent } from './user-card/user-card.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelSectionComponent } from '../create-channel-section/create-channel-section.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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

  isDrawerOpen = false;
  selectedUser: any;
  activeChannelId!: string;

  ngOnInit(): void {
    this.dataUser.showCurrentUserData();
    console.log('user storage id', this.dataUser.userSubcollectionId);
    
    this.unsubChannels = this.dataUser.channelsLoaded$.subscribe(loaded => {
    if (loaded) {
      console.log('channel route',this.dataUser.userSubcollectionChannel);
      this.loadSaveRoute();
      }
    });
  }

  toggleDrawer(drawer: MatDrawer) {
    this.isDrawerOpen = !this.isDrawerOpen;
    drawer.toggle();
  }

  accordion = viewChild.required(MatAccordion);

  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'users');
  item$ = collectionData(this.itemCollection);

  onUserClick(index: number, user: any) {
    this.selectedUser = user;
  }

  readonly dialog = inject(MatDialog);

  openDialog(index: number, user: any) {
    this.dialog.open(UserCardComponent, {
      data: { user },
    });
  }

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
    const channelId = this.dataUser.userSubcollectionChannel;
    if(channelId) {
      this.router.navigate(['mainpage', this.dataUser.currentUserId, 'channel', channelId,]);
    } else {
      this.router.navigate(['mainpage', this.dataUser.currentUserId]);
    }
  }

  openChannel(channelName: string, channelId: string, channelDescription: string) {
    const item = {
      channel: channelId,
      channelName: channelName,
      channelDescription: channelDescription
    };
    this.router.navigate(['mainpage', this.dataUser.currentUserId, 'channel', channelId,]);
    this.getChannelNameandId(channelName, channelId, channelDescription);
    this.dataUser.updateUserStorage(this.dataUser.currentUserId, this.dataUser.userSubcollectionId, item)
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