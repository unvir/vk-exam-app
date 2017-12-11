var app = {
    API_VERSION: '5.69',
    VIEWER_DEVICE_MOBILE: 'mobile',
    ELEMENTS: {
        BTN: {
            INSTALL_APP: document.getElementById('btn-show-install-page'),
            BACK_QUESTION: document.getElementById('btn-question-back'),
            SUBMIT_QUESTION: document.getElementById('btn-question-submit'),
            MATH_EXAM: document.getElementById('btn-math-test'),
            MEM_EXAM: document.getElementById('btn-mem-exam')
        },
        TITLE: {
            HEADER_TITLE: document.getElementById('txt-header-title'),
            EXAM_PROGRESS_TITLE: document.getElementById('txt-exam-progress-title')
        }
    },
    PAGES: {
        INSTALL: new Page('page-install'),
        CHOOSE_EXAM: new Page('page-choose=exam'),
        EXAM: new ExamPage('page-exam')
    },

    appId: 0,
    groupId: 0,

    showInstallPage: function (event) {
        event.preventDefault();
        window.open('https://vk.com/add_community_app.php?aid=' + app.appId, '_blank');
    },

    startExamListener: function (event) {
        event.preventDefault();
        app.PAGES.EXAM.show(event.target.exam);
    },

    getUrlParameter: function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    init: function () {
        app.appId = app.getUrlParameter('api_id');
        app.groupId = app.getUrlParameter('group_id');


        VK.init(null, null, app.API_VERSION);

        sessionStorage.setItem('viewerId', app.getUrlParameter('viewer_id'));
        app.ELEMENTS.BTN.INSTALL_APP.addEventListener('click', app.showInstallPage);

        app.ELEMENTS.BTN.MATH_EXAM.exam = mathExam;
        app.ELEMENTS.BTN.MATH_EXAM.addEventListener('click', startExamListener);
        app.ELEMENTS.BTN.MEM_EXAM.exam = memExam;
        app.ELEMENTS.BTN.MEM_EXAM.addEventListener('click', startExamListener);

        if (app.groupId == 0) {
            app.PAGES.INSTALL.show();
        } else {
            app.PAGES.CHOOSE_EXAM.show();
            app.ELEMENTS.TITLE.EXAM_PROGRESS_TITLE.style.display = 'none';
        }
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

var memExam = {
    title: "На знание мемов",
    countToSolve: 1,
    questions: [
        {
            id: 1,
            title: "Знаете, кто придумал мемы?",
            answers: [
                {
                    value: "Да",
                    isTrueAnswer: true
                },
                {
                    value: "Нет",
                    isTrueAnswer: false
                }
            ]
        },
        {
            id: 2,
            title: "Знаете, как выглядит мем 'Poker face'?",
            answers: [
                {
                    value: "Да",
                    isTrueAnswer: true
                },
                {
                    value: "Нет",
                    isTrueAnswer: false
                }
            ]
        },
        {
            id: 3,
            title: "Мемы с котами классные?",
            answers: [
                {
                    value: "Да",
                    isTrueAnswer: true
                },
                {
                    value: "Нет",
                    isTrueAnswer: false
                },
                {
                    value: "Не знаю",
                    isTrueAnswer: false
                }
            ]
        }
    ]
};