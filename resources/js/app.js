require('./bootstrap');

Vue.component('chat', require('./components/chat/Main.vue'));

const app = new Vue({
    el: '#app'
});
