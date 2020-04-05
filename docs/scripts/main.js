function millisecondsToTimeString(msecs) {
    let secs = msecs / 1000
    if (secs > 5184000) {
        return Math.floor(secs / 2592000) + " months ago"
    }else if (secs >= 2592000) {
        return "1 month ago"
    }else if (secs >= 1209600) {
        return Math.floor(secs / 604800) + " weeks ago"
    }else if (secs >= 604800) {
        return "1 week ago"
    }else if (secs >= 172800) {
        return Math.floor(secs / 86400) + " days ago"
    }else if (secs >= 86400) {
        return "1 day ago"
    }else if (secs >= 7200) {
        return Math.floor(secs / 3600) + " hours ago"
    }else if (secs >= 3600) {
        return "1 hour ago"
    }else if (secs >= 120) {
        return Math.floor(secs / 60) + " minutes ago"
    }else if (secs >= 60) {
        return "1 minute ago"
    }else if (secs === 1) {
        return "1 second ago"
    }else if (secs < 60) {
        return secs + " seconds ago"
    }
}

const store = new Vuex.Store({
    state: {
        currentID: 0,
        githubEvents: []
    },
    mutations: {
        updateID(state, payload) {
            state.currentID = payload
        },
        addGithubEvent(state, event) {
            state.githubEvents.push(event)
        }
    }
})

Vue.component('header-text', {
    template: '<transition name="fade" appear><div><h1>Duncan<br>Fryer</h1><div class=line></div><h2>[ Дункан Фрайер ]</h2></div></transition>'
})

Vue.component('subheader-text', {
    template: '<transition name="fade2" appear><div><h3>University trained and hobbyist programmer with experience and interests in <span class="important">software development</span>, <span class="important">database systems (planning and implementation)</span> and <span class="important">full-stack web development</span>.</h3></div></transition>'
})

Vue.component('activity', {
    template: '<ul><li v-for="event in events"><div><span class="time-since">{{ event.date }}</span><h1><img :src="event.icon"> {{ event.title }}</h1><p>{{ event.comments }}</p><a :href="event.url">{{ event.name }}</a></div></li></ul>',
    computed: {
        events() {
            return store.state.githubEvents
        }
    }
})
    
var main = new Vue({
    el: '#app',
    mounted() {
        this.getEvents()
    },
    methods: {
        updateID(id) {
            store.commit('updateID', id)
        },
        getEvents() {
            axios.get('https://api.github.com/users/alt1f923/events').then((response) => {
                response.data.forEach(function(event) {
                    if(event.type === "PushEvent") {
                        let time = millisecondsToTimeString(Date.now() - Date.parse(event.created_at))
                        let branch = event.payload.ref.split("/")
                        branch = branch[branch.length - 1]
                        let commits = ""
                        event.payload.commits.forEach(function(commit) {
                            commits += commit.message
                            commits += "\n"
                        })
                        store.commit('addGithubEvent', {
                            'icon': 'images/octicons/build/svg/git-commit.svg',
                            'date': time,
                            'name': event.repo.name, 
                            "url": "https://github.com/" + event.repo.name,
                            "title": "Pushed " + event.payload.size + " commit(s) to " + branch,
                            "comments": commits
                        })
                    }else if (event.type === "PullRequestEvent") {
                        let time = millisecondsToTimeString(Date.now() - Date.parse(event.created_at))
                        store.commit('addGithubEvent', {
                            'icon': 'images/octicons/build/svg/git-pull-request.svg',
                            'date': time,
                            'name': event.repo.name, 
                            "url": "https://github.com/" + event.repo.name,
                            "title": event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1) + " pull request: \"" + event.payload.pull_request.title + "\"",
                            "comments": event.payload.pull_request.body
                        })
                    }
                })                    
            }).catch( error => { 
                console.log(error); 
            });
        }
    },
    computed: {
        isProjects() {
            return store.state.currentID === 0
        },
        isActivity() {
            return store.state.currentID === 1
        }
    }
})