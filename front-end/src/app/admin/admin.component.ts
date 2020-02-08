import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { PoNotificationService, PoPageAction, PoModalComponent, PoModalAction, PoPieChartSeries, PoChartType } from '@portinari/portinari-ui';
import { QuestionsService } from '../shared/services/questions.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users = [];

  currentQuestion = 0;

  currentAnswers = [];
	
	questions = [];

  pageActions: Array<PoPageAction>;

  isShowAnswers = false;

  chartAnswers: Array<PoPieChartSeries> = [];
  chartAnswersType: PoChartType = PoChartType.Pie;

  questionText = '';

	answers = [];

  showValue = false;

  gameModalActionPrimary: PoModalAction;
  gameModalActionSecondary: PoModalAction;

	passwordActionPrimary: PoModalAction;

  colors = ['red', 'red', 'red', 'red'];

  timer = 20;

  timeOut$: any;

  numberOfAnswers = 0;

	password = '';

  @ViewChild('gameModal', { static: true}) gameModal: PoModalComponent;
	@ViewChild('passwordModal', { static: true}) passwordModal: PoModalComponent;

  constructor(public socket: Socket,
              public notification: PoNotificationService,
							public questionsService: QuestionsService) { }

  ngOnInit() {
		this.passwordModal.open();
    this.setUpComponents();

    this.socket.on('newUser', user => {
      this.notification.success(`${user.name} entrou no jogo!`)
      this.users.push(user);
    });

    this.socket.on('receiveAnswer', answer => {
      this.users.map((user) => {
        if (user.name === answer.user) {
          if(this.questions[this.currentQuestion - 1].correctAnswer === answer.option) {
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
    this.questions[this.currentQuestion - 1].options.map((option, index) => {
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
        label: 'Iniciar Jogo Front',
        action: () => this.startGame('front'),
				disabled: () => this.password !== 'supersenha'
      },
			{
        label: 'Iniciar Jogo Back',
        action: () => this.startGame('back'),
				disabled: () => this.password !== 'supersenha'
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

		this.passwordActionPrimary = {
			action: () => this.validatePassword(),
			label: 'Acessar'
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

  async startGame(type) {
    this.currentQuestion = 0;
		this.questions = await this.questionsService.getQuestions(type);

    const question = this.questions[this.currentQuestion];
    this.currentQuestion++;
    this.socket.emit('startGame', question);

    this.questionText = question.text;
		this.answers = question.options;
    this.gameModal.open();
    this.generateChart();
    this.startTimer();
  }

  nextQuestion() {
    if (this.currentQuestion === this.questions.length) {
      this.notification.success('Fim de Jogo');
      this.gameModal.close();
      this.socket.emit('endGame');
    }
    const question = this.questions[this.currentQuestion];
    this.currentQuestion++;
    this.socket.emit('nextQuestion', question);

    this.questionText = question.text;
		this.answers = question.options;
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

	validatePassword() {
		if (this.password === 'supersenha') {
			this.passwordModal.close()
		} else {
			this.notification.error('Senha errada! Você deveria mesmo estar aqui?')
		}
	}
}
