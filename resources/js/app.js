require('./bootstrap');

Vue.component('chat', require('./components/Chat.vue'));
Vue.component('chat-channels', require('./components/ChatChannels.vue'));
Vue.component('chat-messages', require('./components/ChatMessages.vue'));
Vue.component('chat-new-message', require('./components/ChatNewMessage.vue'));
Vue.component('chat-participants', require('./components/ChatParticipants.vue'));

const app = new Vue({
    el: '#app'
});
