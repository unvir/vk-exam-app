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
    elem.style.display = 'none';
};

function ExamPage(domId) {
    Page.call(this, domId);

    this.currentQuestion = null;
    this.startExam = function (exam) {
        console.log(exam);

        //TODO
    }
}

ExamPage.prototype = Object.create(Page.prototype);

ExamPage.prototype.show = function (exam) {
    Page.prototype.show.call(this);

    document.getElementById('btn-question-submit').style.display = 'inline-block';
    document.getElementById('txt-progress-title').style.display = 'inline';

    if (!exam) {
        throw new Error('To show exampage need to call this function with exam argument');
    }
    this.startExam(exam);
};

ExamPage.prototype.hide = function () {
    Page.prototype.hide.call(this);

    document.getElementById('btn-question-submit').style.display = 'none';
    document.getElementById('txt-progress-title').style.display = 'none';
};