import { Component } from '@angular/core';
import { WorkSpaceSectionComponent } from './work-space-section/work-space-section.component';
import { ChatSectionComponent } from './chat-section/chat-section.component';
import { ThreadSectionComponent } from './thread-section/thread-section.component';

@Component({
  selector: 'app-main-content',
  imports: [
    WorkSpaceSectionComponent,
    ChatSectionComponent,
    ThreadSectionComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
