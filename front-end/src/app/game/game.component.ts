import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoModalAction, PoNotification, PoNotificationService } from '@portinari/portinari-ui';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  userName = '';
  userLoaded = false;
  answerStopped = false;
  answered = false;
  isGameReady = false;

  timeOut$: any;

  question: any = {};

  endGame = false;

  primaryAction: PoModalAction = {
    action: () => this.savePlayerInfo(),
    label: 'Que comecem os jogos :)'
  }

  @ViewChild('playerInfoModal', { static: true}) playerInfoModal: PoModalComponent;

  constructor(public notification: PoNotificationService,
              private socket: Socket) { }

  ngOnInit() {
    this.playerInfoModal.open();

    this.socket.on('newGame', question => {
      this.isGameReady = true;
      this.question = question;
    });

    this.socket.on('newQuestion', question => {
      this.question = question;
      this.answerStopped = false;
    });

    this.socket.on('receiveQuestionEnd', end => {
      this.answerStopped = end;
    });

    this.socket.on('receiveEndGame', () => {
      this.endGame = true;
      this.answerStopped = true
    });
  }

  savePlayerInfo() {
    if(this.userName !== '') {
      this.userLoaded = true;
      this.playerInfoModal.close();

      this.socket.emit('login', {name: this.userName, points: 0});
    } else {
      this.notification.error('O seu nome por favor :)');
    }
  }

  validateAnswer(option) {
    if(this.answerStopped) {
      return;
    }

    this.socket.emit('validateAnswer', {
      user: this.userName, option: option.id, optionName: option.text
    });

    this.answerStopped = true;
  }
}
