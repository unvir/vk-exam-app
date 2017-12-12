function Page(domId) {
    this.elem = document.getElementById(domId);

    if (!this.elem) {
        throw new Error('Can`t found ' + domId);
    }
    Page.list.push(this);
}

Page.list = [];

Page.prototype.show = function () {
    Page.list.forEach(function (page) {
        page.hide();
    });
    this.elem.style.display = 'block';
};

Page.prototype.hide = function () {
    this.elem.style.display = 'none';
};

function ExamPage(domId) {
    Page.call(this, domId);

    this.examStatus = {
        self: null,
        questionNumber: 0,
        maxQuestion: 0,
        userAnswers: []
    };

    this.btnSubmitHandlers = {
        nextQuestionEvent: function (event) {
            // TODO: get user answers this.examStatus.userAnswers
            this.nextQuestion(this.examStatus.self);
        }.bind(this),
        submitExamEvent: function (event) {
            this.showResults();
        }.bind(this)
    };

    this.startExam = function startExam(exam) {
        this.examStatus.maxQuestion = exam.questions.length;
        this.examStatus.questionNumber = 0;
        this.examStatus.self = exam;

        app.ELEMENTS.TITLE.HEADER_TITLE.innerHTML = 'Экзамен: ' + exam.title;
        app.ELEMENTS.BTN.SUBMIT_QUESTION.innerHTML = 'Далее';

        app.ELEMENTS.BTN.SUBMIT_QUESTION.addEventListener('click', this.btnSubmitHandlers.nextQuestionEvent);

        this.nextQuestion(exam);
    };

    this.nextQuestion = function (exam) {
        this.elem.innerHTML = '';
        this.elem.appendChild(this.renderQuestion(exam.questions[this.examStatus.questionNumber]));

        this.examStatus.questionNumber++;

        if (this.examStatus.questionNumber === this.examStatus.maxQuestion) {
            var btnSubmit = app.ELEMENTS.BTN.SUBMIT_QUESTION;
            btnSubmit.innerHTML = 'Отправить';
            btnSubmit.removeEventListener('click', this.btnSubmitHandlers.nextQuestionEvent);
            btnSubmit.addEventListener('click', this.btnSubmitHandlers.submitExamEvent);
        }
        this.updateCounters();
    };

    this.showResults = function () {
        this.elem.innerHTML = '';
        // TODO: Generate results page
        app.ELEMENTS.BTN.SUBMIT_QUESTION.removeEventListener('click', this.btnSubmitHandlers.submitExamEvent);
        app.ELEMENTS.BTN.SUBMIT_QUESTION.style.display = 'none';

        app.ELEMENTS.BTN.SHOW_EXAMLIST.style.display = 'inline-block';
    };

    this.updateCounters = function () {
        app.ELEMENTS.TITLE.EXAM_PROGRESS_TITLE.innerHTML = 'Вопрос <b>'
            + this.examStatus.questionNumber + '</b> из <b>' + this.examStatus.maxQuestion + '</b>'
    };

    this.renderQuestion = function (question) {
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
            choiceInputElem.id = choiceInputElem.name = 'answer-' + i;

            var choiceTextNode = document.createTextNode(answer.value);

            choiceLabelElem.appendChild(choiceInputElem);
            choiceLabelElem.appendChild(choiceTextNode);
            choiceListItemElem.appendChild(choiceLabelElem);
            choiceListElem.appendChild(choiceListItemElem);
        });

        mainContainerElem.appendChild(questionTitleElem);
        mainContainerElem.appendChild(choiceListElem);

        return mainContainerElem;
    };
}

ExamPage.prototype = Object.create(Page.prototype);

ExamPage.prototype.show = function (exam) {
    Page.prototype.show.call(this);

    if (!exam) {
        throw new Error('To show exam page need to call this function with exam argument');
    }
    app.ELEMENTS.BTN.SUBMIT_QUESTION.style.display = 'inline-block';
    app.ELEMENTS.TITLE.EXAM_PROGRESS_TITLE.style.display = 'block';

    this.startExam(exam);
};

ExamPage.prototype.hide = function () {
    Page.prototype.hide.call(this);

    app.ELEMENTS.BTN.SUBMIT_QUESTION.style.display = 'none';
    app.ELEMENTS.TITLE.EXAM_PROGRESS_TITLE.style.display = 'none';
};