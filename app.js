var app = {
    API_VERSION: '5.69',
    VIEWER_DEVICE_MOBILE: 'mobile',
    ELEMENTS: {
        INSTALL_APP_BUTTON: document.getElementById('btn-show-install-page'),
        SUBMIT_QUESTION_BUTTON: document.getElementById('btn-question-submit'),
        HEADER_TITLE: document.getElementById('txt-title-header'),
        EXAM_PROGRESS_TITLE: document.getElementById('txt-title-exam-progress')
    },
    PAGES: {
        INSTALL: document.getElementById('page-install'),
        EXAM: document.getElementById('page-exam')
    },

    appId: 0,
    groupId: 0,

    show: function (page) {
        page.style.display = 'block';

        if (page === app.PAGES.EXAM){
            app.PAGES.INSTALL.style.display = 'none';
            app.startExam(page.item);
        } else {
            app.PAGES.EXAM.style.display = 'none';
        }
    },

    showInstallPage: function (event) {
        event.preventDefault();
        window.open('https://vk.com/add_community_app.php?aid=' + app.appId, '_blank');
    },

    getUrlParameter: function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    /*EXAM*/
    examStatus: {
        self: null,
        questionNumber: 0,
        maxQuestion: 0,
        userAnswers: []
    },

    btnSubmitHandlers: {
        nextQuestionEvent: function (event) {
            event.preventDefault();
            // TODO: get user answers this.examStatus.userAnswers
            app.nextQuestion(app.examStatus.self);
        }.bind(app),
        submitExamEvent: function (event) {
            event.preventDefault();
            app.showResults();
        }.bind(app)
    },

    startExam: function startExam(exam) {
        app.examStatus.maxQuestion = exam.questions.length;
        app.examStatus.questionNumber = 0;
        app.examStatus.self = exam;
        app.examStatus.userAnswers = [];

        app.ELEMENTS.HEADER_TITLE.innerHTML = 'Экзамен: ' + exam.title;
        app.ELEMENTS.SUBMIT_QUESTION_BUTTON.style.display = 'inline-block';
        app.ELEMENTS.SUBMIT_QUESTION_BUTTON.innerHTML = 'Далее';

        app.ELEMENTS.SUBMIT_QUESTION_BUTTON.addEventListener('click', app.btnSubmitHandlers.nextQuestionEvent);

        app.nextQuestion(exam);
    },

    nextQuestion: function (exam) {
        app.PAGES.EXAM.innerHTML = '';
        app.PAGES.EXAM.appendChild(
            app.renderQuestion(exam.questions[app.examStatus.questionNumber])
        );

        app.examStatus.questionNumber++;

        if (app.examStatus.questionNumber === app.examStatus.maxQuestion) {
            var btnSubmit = app.ELEMENTS.SUBMIT_QUESTION_BUTTON;
            btnSubmit.innerHTML = 'Отправить';
            btnSubmit.removeEventListener('click', app.btnSubmitHandlers.nextQuestionEvent);
            btnSubmit.addEventListener('click', app.btnSubmitHandlers.submitExamEvent);
        }
        app.updateCounters();
    },

    showResults: function () {
        app.PAGES.EXAM.innerHTML = '';
        // TODO: Generate results page
        app.ELEMENTS.SUBMIT_QUESTION_BUTTON.removeEventListener('click', app.btnSubmitHandlers.submitExamEvent);
        app.ELEMENTS.SUBMIT_QUESTION_BUTTON.style.display = 'none';
        app.ELEMENTS.EXAM_PROGRESS_TITLE.style.display = 'none';
    },

    updateCounters: function () {
        app.ELEMENTS.EXAM_PROGRESS_TITLE.innerHTML = 'Вопрос <b>'
            + app.examStatus.questionNumber + '</b> из <b>' + app.examStatus.maxQuestion + '</b>'
    },

    renderQuestion: function (question) {
        var mainContainerElem = document.createElement('div');
        mainContainerElem.classList.add('question');
        mainContainerElem.id = 'question-' + question.id;

        var questionTitleElem = document.createElement('h3');
        questionTitleElem.classList.add('question-title');
        questionTitleElem.innerHTML = question.title;

        var choiceListElem = document.createElement('ul');
        choiceListElem.classList.add('question-choice');

        question.answers.forEach(function (answer, i) {
            var choiceListItemElem = document.createElement('li');

            var choiceLabelElem = document.createElement('label');
            choiceLabelElem.for = 'answer-' + i;

            var choiceInputElem = document.createElement('input');
            choiceInputElem.type = 'radio';
            choiceInputElem.id = 'answer-' + i;
            choiceInputElem.name = 'question-' + question.id;

            var choiceTextNode = document.createTextNode(answer.value);

            choiceLabelElem.appendChild(choiceInputElem);
            choiceLabelElem.appendChild(choiceTextNode);
            choiceListItemElem.appendChild(choiceLabelElem);
            choiceListElem.appendChild(choiceListItemElem);
        });

        mainContainerElem.appendChild(questionTitleElem);
        mainContainerElem.appendChild(choiceListElem);

        return mainContainerElem;
    },

    init: function () {
        app.appId = app.getUrlParameter('api_id');
        app.groupId = app.getUrlParameter('group_id');

        //VK.init(null, null, app.API_VERSION);

        sessionStorage.setItem('viewerId', app.getUrlParameter('viewer_id'));
        app.ELEMENTS.INSTALL_APP_BUTTON.addEventListener('click', app.showInstallPage);
        app.PAGES.EXAM.item = mathExam;

        /*if (app.groupId == 0) {
            app.show(app.PAGES.INSTALL);
        } else {*/
            app.show(app.PAGES.EXAM);
        //}
    }
};

window.addEventListener('load', function () {
    app.init();
});

var mathExam = {
    title: "Математика",
    countToSolve: 3,
    questions: [
        {
            id: 1,
            title: "Сколько будет 2х2?",
            answers: [
                {
                    value: "4",
                    isTrueAnswer: true
                },
                {
                    value: "Кот",
                    isTrueAnswer: false
                }
            ]
        },
        {
            id: 2,
            title: "Как можно найти корни квадратного уравнения?",
            answers: [
                {
                    value: "По теореме Виета",
                    isTrueAnswer: true
                },
                {
                    value: "Умножить коэффициенты уравнения",
                    isTrueAnswer: false
                },
                {
                    value: "Сложить коэффициенты уравнения",
                    isTrueAnswer: false
                }
            ]
        },
        {
            id: 3,
            title: "Каким способом можно вычислить вторую производную функции f(x)=x*x ?",
            answers: [
                {
                    value: "Лечь на пол и заплакать",
                    isTrueAnswer: false
                },
                {
                    value: "Поделить функцию на ноль",
                    isTrueAnswer: false
                },
                {
                    value: "Спросить у мудреца под куполом офиса ВКонтакте",
                    isTrueAnswer: false
                },
                {
                    value: "Взять производную от 2x и выбросить ее",
                    isTrueAnswer: false
                }
            ]
        }
    ]
};