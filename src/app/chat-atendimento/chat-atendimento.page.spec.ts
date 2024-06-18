import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAtendimentoPage } from './chat-atendimento.page';

describe('ChatAtendimentoPage', () => {
  let component: ChatAtendimentoPage;
  let fixture: ComponentFixture<ChatAtendimentoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChatAtendimentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
