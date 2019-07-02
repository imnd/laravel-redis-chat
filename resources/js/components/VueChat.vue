<template>
    <div class="chat">
        <div class="columns main-wrapper">
            <div class="column is-2">
                <vue-chat-channels
                    :channels="channels"
                    :active-channel="activeChannel"
                    @channelChanged="onChannelChanged"
                />
            </div>

            <div class="column">
                <vue-chat-messages :messages="messages" />
            </div>

            <div class="column is-2">
                participants
            </div>
        </div>

        <vue-chat-new-message
            :active-channel="activeChannel"
            :username="username" />
    </div>
</template>

<script>
    export default {
        props: ['channels'],
        data() {
            return {
                activeChannel: this.channels[0].id,
                messages: [],
                username: 'username_' + Math.random().toString(36).substring(7),
            };
        },
        methods: {
            fetchMessages() {
                let endpoint = `/channels/${this.activeChannel}/messages`;
                axios
                    .get(endpoint)
                    .then(({ data }) => {
                        this.messages = data;
                    });
            },
            onChannelChanged(id) {
                this.activeChannel = id;
                this.fetchMessages();
            }
        },
        created() {
            this.fetchMessages();
            // Connect to Socket.io
            let socket = io(`http://localhost:3000`);
            // For each channel...
            for (let channel of this.channels) {
                // ... listen for new events/messages
                socket.on(`laravel_database_${channel.name}:App\\Events\\MessageSent`, data => {
                    if (this.activeChannel === channel.id) {
                        this.messages.push(data.data);
                    }
                });
            }
        },
    }
</script>
