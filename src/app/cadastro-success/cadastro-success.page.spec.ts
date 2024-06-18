import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroSuccessPage } from './cadastro-success.page';

describe('CadastroSuccessPage', () => {
  let component: CadastroSuccessPage;
  let fixture: ComponentFixture<CadastroSuccessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CadastroSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
