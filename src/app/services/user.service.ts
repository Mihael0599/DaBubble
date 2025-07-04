import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  CollectionReference,
  collectionData,
  getDoc,
  docData,
} from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { Channel } from '../../models/channel.class';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  userData: User[] = [];
  currentUser?: User;
  channels: any[] = [];
  currentUserId!: string;
  createChannel!: Channel;
  showChannelByUser: any[] = [];
  channelCreaterId!: string;
  channelCreaterName: string = '';
  channelCreaterLastname: string = '';

  unsubscribeUserData!: Subscription;
  private routeSub?: Subscription;
  unsubscribeUserChannels!: Subscription;;

  loginIsSucess = false;

  getUsersCollection(): CollectionReference {
    return collection(this.firestore, 'users');
  }

  getSingleUserRef(docId: string) {
    return doc(this.getUsersCollection(), docId);
  }

  getChannelRef() {
    return collection(this.firestore, 'channels');
  }

  getChatRef(docId: string) {
    return collection(this.getSingleUserRef(docId), 'chats');
  }

  async loginService(email: string, password: string) {
    const userQuery = query(
      this.getUsersCollection(),
      where('email', '==', email),
      where('password', '==', password)
    );

    const result = await getDocs(userQuery);

    if (!result.empty) {
      const userDoc = result.docs[0];
      this.currentUserId = userDoc.id;
      this.loginIsSucess = true;
    }
  }

  async createUserWithSubcollections(user: User): Promise<string> {
    try {
      const userRef = await addDoc(collection(this.firestore, 'users'), {
        name: user.name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
      });
      const userId = userRef.id;
      const channelsCollection = collection(
        this.firestore,
        `users/${userRef.id}/channels`
      );
      await addDoc(channelsCollection, {});
      const chatsCollection = collection(
        this.firestore,
        `users/${userRef.id}/chats`
      );
      await addDoc(chatsCollection, {});
      return userId;
    } catch (error) {
      throw error;
    }
  }

  saveUserToLocalStorage(user: User): void {
    localStorage.setItem('pendingUser', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User | null {
    const userData = localStorage.getItem('pendingUser');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }

  clearUserFromLocalStorage(): void {
    localStorage.removeItem('pendingUser');
  }

  async completeUserRegistration(user: User): Promise<boolean> {
    try {
      await this.createUserWithSubcollections(user);
      this.clearUserFromLocalStorage();
      return true;
    } catch (error) {
      console.error('Error completing registration:', error);
      return false;
    }
  }

  async addNewChannel(allChannels: {}, userId: string, user: string) {
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    const channelWithUser = {
      ...allChannels,
      userId: [userId],
      createdBy: user,
      createdAt: dateNow,
    };
    await addDoc(collection(this.firestore, 'channels'), channelWithUser);
  }

  getChannelUserId() {
    const firstChannel = this.showChannelByUser[1];
    this.channelCreaterId = firstChannel.createdBy;
  }

  async getChannelUserName() {
    const channelRef = this.getSingleUserRef(this.channelCreaterId);
    const snapshot = await getDoc(channelRef);
    const data = snapshot.data();
    if (data) {
      this.channelCreaterName = data['name'];
      this.channelCreaterLastname = data['lastname'];
    }
  }

  showCurrentUserData() {
    const userRef = this.getSingleUserRef(this.currentUserId);
    this.unsubscribeUserData = docData(userRef).subscribe((data) => {
      this.currentUser = new User(data);
      console.log('current user id', this.currentUserId);
      console.log('current detail', this.currentUser);
    });
  }

  showUserChannel() {
    const channelRef = this.getChannelRef();
    this.unsubscribeUserChannels = collectionData(channelRef, { idField: 'channelId' })
    .subscribe(channels => {
      this.channels = [];
      this.channels = channels;
      this.checkChannel();
      console.log(this.channels);
    });
  }

  checkChannel() {
    this.showChannelByUser = [];
    this.channels.forEach((channel) => {
      if (
        Array.isArray(channel.userId) &&
        channel.userId.includes(this.currentUserId)
      ) {
        this.showChannelByUser.push({
          ...channel,
        });
      }
    });
  }

   ngOnDestroy(): void {
    this.unsubscribeUserData?.unsubscribe();
    this.unsubscribeUserChannels?.unsubscribe();
   }
}