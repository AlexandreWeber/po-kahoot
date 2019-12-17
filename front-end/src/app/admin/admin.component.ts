import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { PoNotificationService, PoPageAction, PoModalComponent, PoModalAction, PoPieChartSeries, PoChartType } from '@portinari/portinari-ui';
import { questions } from './questions';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users = [];

  currentQuestion = 0;

  currentAnswers = [];

  pageActions: Array<PoPageAction>;

  isShowAnswers = false;

  chartAnswers: Array<PoPieChartSeries> = [];
  chartAnswersType: PoChartType = PoChartType.Pie;

  questionText = '';

  showValue = false;

  gameModalActionPrimary: PoModalAction;
  gameModalActionSecondary: PoModalAction;

  colors = ['red', 'red', 'red', 'red'];

  timer = 20;

  timeOut$: any;

  numberOfAnswers = 0;

  @ViewChild('gameModal', { static: true}) gameModal: PoModalComponent;

  constructor(public socket: Socket,
              public notification: PoNotificationService) { }

  ngOnInit() {
    this.setUpComponents();

    this.socket.on('newUser', user => {
      this.notification.success(`${user.name} entrou no jogo!`)
      this.users.push(user);
    });

    this.socket.on('receiveAnswer', answer => {
      this.users.map((user) => {
        if (user.name === answer.user) {
          if(questions[this.currentQuestion - 1].correctAnswer === answer.option) {
            user.points += 200 * this.timer;
          }
        }
      });

      this.chartAnswers.map((chart) => {
        if (chart.category === answer.optionName) {
          chart.value++;
        }
      });

      this.currentAnswers.push(answer.option);
      this.orderPlayers();

      this.notification.warning(`O jogador ${answer.user} respondeu!`);
      this.numberOfAnswers++;

      if (this.numberOfAnswers === this.users.length) {
        this.timer = 0;
      }
    });
  }

  generateChart() {
    this.chartAnswers = [];
    questions[this.currentQuestion - 1].options.map((option, index) => {
      this.chartAnswers.push(
        {
          category: option.text,
          value: 0,
          color: this.colors[index]
        }
      );
    });
  }

  setUpComponents() {
    this.pageActions = [
      {
        label: 'Iniciar Jogo',
        action: () => this.startGame()
      }
    ];

    this.gameModalActionPrimary = {
      action: () => this.nextQuestion(),
      label: 'Próxima pergunta'
    }

    this.gameModalActionSecondary = {
      action: () => this.showAnsers(),
      label: 'Ver respostas'
    }

  }

  orderPlayers() {
    this.users.sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      } else if (b.points > a.points) {
        return 1;
      }

      return 0;
    })
  }

  startGame() {
    this.currentQuestion = 0;

    const question = questions[this.currentQuestion];
    this.currentQuestion++;
    this.socket.emit('startGame', question);

    this.questionText = question.text;
    this.gameModal.open();
    this.generateChart();
    this.startTimer();
  }

  nextQuestion() {
    if (this.currentQuestion === questions.length) {
      this.notification.success('Fim de Jogo');
      this.gameModal.close();
      this.socket.emit('endGame');
    }
    const question = questions[this.currentQuestion];
    this.currentQuestion++;
    this.socket.emit('nextQuestion', question);

    this.questionText = question.text;
    this.timer = 20;
    this.currentAnswers = [];
    this.isShowAnswers = false;
    this.numberOfAnswers = 0;
    this.generateChart();

  }

  startTimer() {
    this.timer = 20;
    this.timeOut$ = setInterval(() => {
      if (this.timer > 0) {
        this.timer = this.timer - 0.01;
      } else {
        this.timer = 0;
        this.socket.emit('questionEnd', true)
      }
    }, 10);
  }

  showAnsers() {
    this.isShowAnswers = true;
  }
}
