document.addEventListener('DOMContentLoaded', () => {
    // --- وظائف الشريط الجانبي وتغيير الثيم (لا تغيير هنا) ---
    const sidebar = document.querySelector('.announcement-sidebar');
    const openSidebarBtn = document.querySelector('.open-sidebar-btn'); // زر الثلاث نقاط
    const closeSidebarBtn = document.querySelector('.close-sidebar-btn'); // زر الـ X داخل اللوحة
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (openSidebarBtn && sidebar) {
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 992 && sidebar.classList.contains('open') &&
            !sidebar.contains(event.target) && !openSidebarBtn.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('open');
        }
    });

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            themeToggle.checked = (savedTheme === 'dark-mode');
        } else {
            body.classList.add('light-mode');
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // --- وظيفة التمرير للأسفل (سهم التمرير) (لا تغيير هنا) ---
    const scrollDownContainer = document.querySelector('.scroll-down-container');
    if (scrollDownContainer) {
        scrollDownContainer.addEventListener('click', () => {
            window.scrollTo({
                top: document.querySelector('main').offsetTop,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollDownContainer.style.display = 'none';
            } else {
                scrollDownContainer.style.display = 'block';
            }
        });
    }

    // --- وظيفة تبديل المراحل (الفصول الدراسية) (لا تغيير هنا) ---
    const semesterSections = document.querySelectorAll('#semester-1, #semester-2');

    semesterSections.forEach(section => {
        const stageButtons = section.querySelectorAll('.stage-btn');
        const materialsGrids = section.querySelectorAll('.materials-grid');

        stageButtons.forEach(button => {
            button.addEventListener('click', () => {
                stageButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                materialsGrids.forEach(grid => grid.style.display = 'none');

                const targetId = button.dataset.target;
                const targetGrid = section.querySelector(`#${targetId}`);
                if (targetGrid) {
                    targetGrid.style.display = 'grid';
                }
            });
        });

        if (stageButtons.length > 0) {
            stageButtons[0].classList.add('active');
            materialsGrids[0].style.display = 'grid';
        }
    });


    // --- وظائف الاختبار البرمجي ---
    const langButtons = document.querySelectorAll('.lang-btn');
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const questionDisplay = document.getElementById('question-display');
    const timerDisplay = document.getElementById('timer-display');
    const timeSpan = document.getElementById('time');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quizResults = document.getElementById('quiz-results');
    const resultMessage = document.getElementById('result-message');
    const scoreDisplay = document.getElementById('score-display');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const languageSelectionDiv = document.querySelector('.language-selection');

    let currentQuizLang = '';
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    const TIME_PER_QUESTION = 60; // 60 ثانية لكل سؤال

    // متغير لتخزين أسئلة الاختبار الحالية بعد الترتيب العشوائي
    let currentQuizQuestions = [];

    // تعريف الأسئلة
    // (تمت إضافة المزيد من الأسئلة لكل لغة لزيادة التنوع عند الترتيب العشوائي)
    const quizzes = {
        cpp: [
            {
                question: "ما هي الكلمة المفتاحية المستخدمة لتعريف ثابت لا يمكن تغييره في C++؟",
                options: ["const", "static", "final", "define"],
                answer: "const"
            },
            {
                question: "أي من التالي هو مُشغل لزيادة القيمة بمقدار 1 في C++؟",
                options: ["++", "--", "**", "=="],
                answer: "++"
            },
            {
                question: "ما هو نوع البيانات الذي يستخدم لتخزين الأعداد الصحيحة فقط في C++؟",
                options: ["float", "double", "int", "char"],
                answer: "int"
            },
            {
                question: "ما هي الدالة الرئيسية (entry point) في برنامج C++؟",
                options: ["start()", "run()", "main()", "execute()"],
                answer: "main()"
            },
            {
                question: "ما هو الرمز المستخدم لإنهاء جملة برمجية في C++؟",
                options: [".", ":", ";", ","],
                answer: ";"
            }
        ],
        java: [
            {
                question: "ما هي الكلمة المفتاحية المستخدمة لوراثة الفئات في جافا؟",
                options: ["implements", "extends", "inherits", "uses"],
                answer: "extends"
            },
            {
                question: "ما هو الكائن الأساسي الذي يتم من خلاله إنشاء جميع الكائنات الأخرى في جافا؟",
                options: ["Class", "Object", "Main", "System"],
                answer: "Object"
            },
            {
                question: "أي من التالي هو طريقة لطباعة نص إلى وحدة التحكم في جافا؟",
                options: ["console.log()", "System.out.println()", "print()", "display()"],
                answer: "System.out.println()"
            },
            {
                question: "ماذا تعني 'JVM' في سياق جافا؟",
                options: ["Java Virtual Machine", "Java Verification Module", "Joint Virtual Memory", "JavaScript Virtual Method"],
                answer: "Java Virtual Machine"
            },
            {
                question: "أي تعديل (modifier) يجعل المتغير أو الدالة متاحة من أي مكان؟",
                options: ["private", "protected", "default", "public"],
                answer: "public"
            }
        ],
        python: [
            {
                question: "ما هي الكلمة المفتاحية المستخدمة لتعريف دالة في بايثون؟",
                options: ["func", "define", "def", "function"],
                answer: "def"
            },
            {
                question: "كيف تقوم بالتعليق (Comment) على سطر واحد في بايثون؟",
                options: ["//", "/* */", "#", "--"],
                answer: "#"
            },
            {
                question: "ما هي الدالة المستخدمة لإدخال بيانات من المستخدم في بايثون؟",
                options: ["get_input()", "read()", "input()", "receive()"],
                answer: "input()"
            },
            {
                question: "ما هو نوع البيانات المستخدم لتخزين مجموعة غير مرتبة وغير قابلة للتغيير من العناصر الفريدة في بايثون؟",
                options: ["list", "tuple", "set", "dictionary"],
                answer: "set"
            },
            {
                question: "كيف تتحقق مما إذا كانت قيمة موجودة في قائمة (List) في بايثون؟",
                options: ["value in list", "list.contains(value)", "value exists list", "list.find(value)"],
                answer: "value in list"
            }
        ]
    };

    // عبارات تشجيعية متنوعة
    const encouragingMessages = {
        high: [
            "أداء رائع! أنت نجم في البرمجة!",
            "مذهل! معرفتك البرمجية استثنائية!",
            "عبقري! لقد أبهرتنا بإجاباتك الصحيحة!",
            "يا له من إتقان! أنت على الطريق الصحيح لتصبح مبرمجًا خبيرًا!"
        ],
        medium: [
            "أداء جيد جداً! استمر في التعلم وستصل إلى القمة!",
            "جهد مقدر! بعض المراجعة وستكون أفضل بكثير!",
            "تقدم ملحوظ! هذا يثبت أنك تستوعب المفاهيم الأساسية.",
            "ممتاز! قريب جداً من الكمال، واصل العمل الشاق!"
        ],
        low: [
            "بداية موفقة! كل مبرمج بدأ من الصفر، استمر في المحاولة!",
            "لا بأس! هذه فرصة رائعة لتحديد نقاط الضعف وتحسينها.",
            "تذكر أن الفشل هو أول خطوة نحو النجاح. حاول مرة أخرى!",
            "البرمجة تحتاج إلى الممارسة، ستتحسن مع كل محاولة!"
        ]
    };

    // دالة لترتيب عناصر المصفوفة عشوائياً (Fisher-Yates shuffle)
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function startTimer() {
        let timeLeft = TIME_PER_QUESTION;
        timeSpan.textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;

        timerInterval = setInterval(() => {
            timeLeft--;
            timeSpan.textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkAnswer(null); // تمرير null إذا انتهى الوقت (يعني إجابة خاطئة)
            }
        }, 1000);
    }

    function displayQuestion() {
        clearInterval(timerInterval); // إيقاف أي مؤقت سابق
        startTimer(); // بدء مؤقت جديد لكل سؤال

        const questionObj = currentQuizQuestions[currentQuestionIndex];

        questionDisplay.innerHTML = `
            <p>${currentQuestionIndex + 1}. ${questionObj.question}</p>
            <div class="options">
                ${questionObj.options.map((option, index) => `
                    <label>
                        <input type="radio" name="answer" value="${option}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
        submitQuizBtn.style.display = 'block';
        nextQuestionBtn.style.display = 'none';
        // إزالة التلوين من الخيارات السابقة
        questionDisplay.querySelectorAll('.options label').forEach(label => {
            label.style.backgroundColor = '';
            label.style.color = '';
        });
    }

    function checkAnswer(selectedOptionValue) {
        clearInterval(timerInterval); // إيقاف المؤقت
        const questionObj = currentQuizQuestions[currentQuestionIndex];
        const options = questionDisplay.querySelectorAll('input[type="radio"]');

        let isCorrect = false;
        if (selectedOptionValue === questionObj.answer) {
            score++;
            isCorrect = true;
        }

        // إظهار الإجابة الصحيحة والخاطئة
        options.forEach(option => {
            const label = option.closest('label');
            if (option.value === questionObj.answer) {
                label.style.backgroundColor = '#d4edda'; // لون أخضر للإجابة الصحيحة
                label.style.color = '#155724';
            } else if (option.checked && !isCorrect) {
                label.style.backgroundColor = '#f8d7da'; // لون أحمر للإجابة الخاطئة
                label.style.color = '#721c24';
            }
            option.disabled = true; // تعطيل جميع الخيارات بعد الإجابة
        });

        submitQuizBtn.style.display = 'none';

        if (currentQuestionIndex < currentQuizQuestions.length - 1) {
            nextQuestionBtn.style.display = 'block';
        } else {
            showResults();
        }
    }

    function showResults() {
        quizContainer.style.display = 'none';
        quizResults.style.display = 'block';
        languageSelectionDiv.style.display = 'none'; // إخفاء أزرار اختيار اللغة

        const totalQuestions = currentQuizQuestions.length;
        const percentage = (score / totalQuestions) * 100;

        let messageCategory;
        if (percentage >= 80) {
            messageCategory = 'high';
        } else if (percentage >= 50) {
            messageCategory = 'medium';
        } else {
            messageCategory = 'low';
        }

        // اختيار رسالة تشجيعية عشوائية من الفئة المناسبة
        const messages = encouragingMessages[messageCategory];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        resultMessage.textContent = randomMessage;

        // ضبط لون الرسالة بناءً على الفئة
        if (messageCategory === 'high') {
            resultMessage.style.color = '#28a745'; // أخضر
        } else if (messageCategory === 'medium') {
            resultMessage.style.color = '#ffc107'; // برتقالي
        } else {
            resultMessage.style.color = '#dc3545'; // أحمر
        }

        scoreDisplay.textContent = `لقد أجبت على ${score} من أصل ${totalQuestions} أسئلة بشكل صحيح.`;
    }

    // معالجة اختيار اللغة
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentQuizLang = e.target.dataset.lang;
            quizTitle.textContent = `اختبار ${e.target.textContent}`;

            // تصفير النتيجة والفهرس
            currentQuestionIndex = 0;
            score = 0;

            // الحصول على أسئلة اللغة المختارة وإنشاء نسخة مرتبة عشوائياً
            // استخدام slice() لإنشاء نسخة جديدة من المصفوفة قبل خلطها
            currentQuizQuestions = shuffleArray(quizzes[currentQuizLang].slice()).slice(0, 3); // خذ أول 3 أسئلة بعد الترتيب العشوائي

            languageSelectionDiv.style.display = 'none'; // إخفاء أزرار اختيار اللغة
            quizContainer.style.display = 'block'; // إظهار حاوية الاختبار
            quizResults.style.display = 'none'; // إخفاء النتائج إذا كانت ظاهرة
            
            displayQuestion();
        });
    });

    // معالجة زر الإرسال
    submitQuizBtn.addEventListener('click', () => {
        const selectedOption = questionDisplay.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            checkAnswer(selectedOption.value);
        } else {
            alert('الرجاء اختيار إجابة قبل الإرسال.');
        }
    });

    // معالجة زر السؤال التالي
    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    // معالجة زر حاول مرة أخرى
    tryAgainBtn.addEventListener('click', () => {
        quizResults.style.display = 'none';
        languageSelectionDiv.style.display = 'flex'; // إظهار أزرار اختيار اللغة مرة أخرى
        // سيتم إعادة تعيين المتغيرات (score, currentQuestionIndex, currentQuizQuestions) عند اختيار لغة جديدة
    });
});