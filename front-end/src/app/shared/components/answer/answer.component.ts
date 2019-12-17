import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit, AfterViewInit {

  @Input() color: '';
  @Input() name: '';
  @Input() option: '';

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const el: any = document.querySelector(`#${this.name} .container`);
    el.style.backgroundColor = this.color;
  }
}
