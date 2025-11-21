// Data Configuration
const cards = [
    {
        image: './img/photo-1550751827-4bd374c3f58b.jpg',
        text: 'Тобі подобається читати, писати тексти або вивчати мови?'
    },
    {
        image: './img/photo-1581091226825-a6a2a5aee158.jpg',
        text: 'Тобі цікаво, як влаштовані механізми та пристрої?'
    },
    {
        image: './img/photo-1556742502-ec7c0e9f34b1.jpg',
        text: 'Тобі подобається організовувати заходи чи керувати проєктами?'
    },
    {
        image: './img/photo-1509228468518-180dd4864904.jpg',
        text: 'Тобі подобається вирішувати логічні задачі та головоломки?'
    },
    {
        image: './img/photo-1522071820081-009f0129c71c.jpg',
        text: 'Тобі легко спілкуватися з різними людьми та домовлятися?'
    },
    {
        image: './img/photo-1581092160562-40aa08e78837.jpg',
        text: 'Ти любиш щось конструювати, збирати чи ремонтувати своїми руками?'
    },
    {
        image: './img/photo-1518770660439-4636190af475.jpg',
        text: 'Тобі подобається розбиратися, як працюють додатки та ігри?'
    },
    {
        image: './img/photo-1573497019940-1c28c88b4f3e.jpg',
        text: 'Ти легко розумієш почуття інших людей і любиш допомагати?'
    },
    {
        image: './img/photo-1554224155-6726b3ff858f.jpg',
        text: 'Тебе цікавить, як заробляють гроші компанії та бренди?'
    },
    {
        image: './img/photo-1503387762-592deb58ef4e.jpg',
        text: 'Тобі подобаються точні науки: фізика, математика, креслення?'
    },
    {
        image: './img/photo-1559027615-cd4628902d4a.jpg',
        text: 'Тобі важливо робити світ кращим і допомагати іншим?'
    },
    {
        image: './img/photo-1550745165-9bc0b252726f.jpg',
        text: 'Ти легко вчишся користуватися новими програмами чи гаджетами?'
    },
    {
        image: './img/photo-1556761175-b413da4baf72.jpg',
        text: 'Ти мрієш відкрити власний бізнес або стартап?'
    },
    {
        image: './img/photo-1581092918056-0c4c3acd3789.jpg',
        text: 'Тобі б хотілось винаходити нові технології чи покращувати існуючі?'
    },
    {
        image: './img/photo-1529156069898-49953e39b3ac.jpg',
        text: 'Тебе цікавлять історія, психологія, культура чи суспільство?'
    },
    {
        image: './img/photo-1460925895917-afdab827c52f.jpg',
        text: 'Тебе цікавить створення сайтів, ботів або мобільних додатків?'
    },
    {
        image: './img/photo-1557804506-669a67965ba0.jpg',
        text: 'Ти вмієш переконувати людей та знаходити вигідні рішення?'
    },
    {
        image: './img/photo-1581092160607-ee22621dd758.jpg',
        text: 'Тебе приваблює робота на виробництві, в лабораторії чи на будівництві?'
    },
    {
        image: './img/photo-1504384308090-c894fdcc538d.jpg',
        text: 'Тобі б хотілось працювати за компʼютером більшість часу?'
    },
    {
        image: './img/photo-1503676260728-1c00da094a0b.jpg',
        text: 'Тобі б хотілось працювати з людьми: навчати, консультувати, лікувати?'
    }
];

const educationDirections = [
    {
        id: 1,
        name: 'ІТ-освіта',
        url: 'https://vstup.kpi.kharkov.ua/admission/it-osvita/'
    },
    {
        id: 2,
        name: 'Інженерно-технічна освіта',
        url: 'https://vstup.kpi.kharkov.ua/admission/engineering/'
    },
    {
        id: 3,
        name: 'Бізнес-освіта',
        url: 'https://vstup.kpi.kharkov.ua/admission/biznes-osvita/'
    },
    {
        id: 4,
        name: 'Соціально-гуманітарна освіта',
        url: 'https://vstup.kpi.kharkov.ua/admission/humanitarna-osvita/'
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cards, educationDirections };
}
