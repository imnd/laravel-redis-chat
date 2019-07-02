<template>
    <div class="chat">
        <div class="columns main-wrapper">
            <channels
                :channels="channels"
                :active-channel="activeChannel"
                @channelChanged="onChannelChanged"
            />
            <messages :messages="messages" />
            <participants :participants="participants" />
        </div>
        <new-message
            :active-channel="activeChannel"
            :username="username"
        />
    </div>
</template>

<script>
    import Channels from './Channels'
    import Messages from './Messages'
    import NewMessage from './NewMessage'
    import Participants from './Participants'

    export default {
        components: {
            Channels,
            Messages,
            NewMessage,
            Participants,
        },
        props: ['channels'],
        data() {
            return {
                activeChannel: this.channels[0].id,
                participants: [],
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
            // let socket = io(`http://localhost:3000`);
            let socket = io(`http://localhost:3000?username=${this.username}`);
            // For each channel...
            for (let channel of this.channels) {
                // ... listen for new events/messages
                socket.on(`laravel_database_${channel.name}:App\\Events\\MessageSent`, data => {
                    if (this.activeChannel === channel.id) {
                        this.messages.push(data.data);
                    }
                });
            }
            // Push a new "virtual" message to the messages array after someone has
            // entered the chat. "virtual" means this message won't be persisted in the
            // database and will be only shown once
            socket.on(`user-joined`, data => {
                this.participants = data.participants;
                this.messages.push({
                    message: `${data.username} has joined the chat.`,
                    author_username: 'system',
                });
            });
            // Same thing for after someone has disconnected from the chat
            socket.on(`user-left`, data => {
                this.participants = data.participants;
                this.messages.push({
                    message: `${data.username} has left the chat.`,
                    author_username: 'system',
                });
            });
        },
    }
</script>
