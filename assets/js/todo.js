var vm = new Vue({
    delimiters: ['${', '}'],
    el: '#section1',
    data: {
        articleInput: '',
        placeHolder: 'entrez un article',
        articles: [],
        myStyle: {
            autofocus: 'autofocus'
        }
    },
    methods: {
        newArticle: function (event) {
            event.preventDefault();
            console.log('bzit');
            this.articles.push(this.articleInput);
            this.articleInput = '';
        },
        removeArticle: function (el) {
            console.log(el.target);
            el.target.remove();
        }
    },
    mounted: function () {
        this.articles = JSON.parse(document.querySelector('#section1').getAttribute('data-initialArticles'));
    }

})