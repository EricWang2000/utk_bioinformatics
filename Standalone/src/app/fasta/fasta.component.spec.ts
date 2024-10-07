import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastaComponent } from './fasta.component';

describe('FastaComponent', () => {
  let component: FastaComponent;
  let fixture: ComponentFixture<FastaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FastaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
