import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedMessageComponent } from './received-message.component';

describe('ReceivedMessageComponent', () => {
  let component: ReceivedMessageComponent;
  let fixture: ComponentFixture<ReceivedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
