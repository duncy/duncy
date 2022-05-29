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
        pageStateID: 0,
        codebarCurrentID: 0,
        githubEvents: [],
        codebarList: [
            {id: 0, content: "I am very proficient in Python, as I have been programming in it since High School, from the start it has been one of my languages of choice for building fun hobby projects and University assignments. I am familiar with using it for webscraping, interacting with APIs, presenting data and using multithreading/asyncronous programming to boost performance."
            },
            {id: 1, content: "I have been using JavaScript since 2017, I am familiar with using deno and node, and have experience using Vue and Vuex. "},
            {id: 2, content: "I have experience using R from my University studies learning Data Science and statistics, as a result I am able to interact with APIs and files such as .csv to generate data tables that can be presented to show trends in said data."},
            {id: 3, content: "I am experienced with using SQL in a multitude of projects, from High School, to personal projects and to University assignments. I am familiar with the Enhanced Entity Relation model, relational algebra and SQL joins. I have used PostgreSQL, MySQL and Oracle SQL."},
            {id: 4, content: "Rust is a language that I enjoy using very much. I have been using it since 2019 for a variety of small projects. I am familiar with using one of it's asyncronous libraries and am familiar with using it's core features."},
            {id: 5, content: "I am experienced with C in use for microcontrollers, such as the ATmega32 microcontroller, for which I collaboratively wrote a program for as part of a University assignment. I have an understanding of how to use malloc."},
            {id: 6, content: "I am relatively new to C++ as I am currently using it to do basic 3D rendering of GLUT objects using OpenGL."},
            {id: 7, content: "I have used PHP. Not really much more to say about it."}]
    },
    mutations: {
        updatePageStateID(state, payload) {
            state.pageStateID = payload
        },
        setCodebarID(state, payload) {
            state.codebarCurrentID = payload
        },
        addGithubEvent(state, event) {
            state.githubEvents.push(event)
        }
    },
    getters: {
        getCodebarContent: state => {
            return store.state.codebarList[store.state.codebarCurrentID].content
        }
    }
})

Vue.component('header-text', {
    template: '<transition name="fade" appear><div><h1>Duncan<br>Fryer</h1><div class=line></div><h2>[ Дункан Фрайер ]</h2></div></transition>'
})

Vue.component('subheader-text', {
    template: '<transition name="fade2" appear><div><h3>University student and hobbyist programmmer with experience in <span class="important">multiple programmming languages</span>, <span class="important">database systems (planning and implementation)</span> and <span class="important">linux</span> with an interest to learn more.</h3></div></transition>'
})

Vue.component('code-bar-info', {
    template: '<div id="code-bar-info"><p>{{ getContent }}</p></div>',
    computed: {
        getContent() {
            return store.getters.getCodebarContent
        }
    }
})

Vue.component('activity', {
    template: '<ul><li v-if="!events.length"><div>Looks as though there hasn\'t been any activity in a while... must be exam season. 😅</div></li><li v-for="event in events"><div><span class="time-since">{{ event.date }}</span><h1><img :src="event.icon"> {{ event.title }}</h1><p>{{ event.comments }}</p><a :href="event.url">{{ event.name }}</a></div></li></ul>',
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
        updatePageStateID(id) {
            store.commit('updatePageStateID', id)
        },
        setCodebarID(id) {
            store.commit('setCodebarID', id)
        },
        getEvents() {
            axios.get('https://api.github.com/users/duncy/events').then((response) => {
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
            return store.state.pageStateID === 0
        },
        isActivity() {
            return store.state.pageStateID === 1
        }
    }
})
