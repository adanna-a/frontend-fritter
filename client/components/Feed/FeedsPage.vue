<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
      <section v-if="$store.state.username">
        <header>
          <h2>@{{ $store.state.username }}</h2>
        </header>
        <CreateFolloweeForm />
      </section>
  
      <section>
        <header>
          <div class="left">
            <h2>
              <span v-if="$store.state.filter">
                by @{{ $store.state.filter }}
              </span>
            </h2>
          </div>
          <div>
  
          </div>
        </header>
        <section
          v-if="feeds.length > 0"
        >
        <FeedComponent
            v-for="feed in feeds"
            :key="feed.id"
            :feed="feed"
        />
        </section>
        <article
          v-else
        >
          <h3>No feeds found.</h3>
        </article>
      </section>
    </section>
  <section v-else>
    <h3>Sign in to see more!</h3>
  </section>
    </main>
</template>
  
  <script>
  import FeedComponent from '@/components/Feed/FeedComponent.vue';
  import CreateFolloweeForm from '@/components/Feed/CreateFolloweeForm.vue';

  export default {
    name: 'FeedsPage', 
    components: {CreateFolloweeForm, FeedComponent},
    data() {
      return {
        feeds: [],
      }
    },
    methods: {
      getFollowees() {
        /**
         * Get the feeds for the user
         */
        const params = {
            method: 'GET',
            callback: () => {}
        };
        this.followee_request(params);
      },
      async followee_request(params) {
        /**
         * Submits a request to the followee's endpoint
         * @param params - Options for the request
         * @param params.body - Body for the request, if it exists
         * @param params.callback - Function to run if the the request succeeds
         */
        const options = {
          method: params.method, headers: {'Content-Type': 'application/json'}
        };
        if (params.body) {
          options.body = params.body;
        }

        try {
          if (options.method == 'GET') {
            const r = await fetch(`/api/followees`, options);
            const res = await r.json();
            
            if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
            }
            params.callback();

            const feeds = {};
            for (var i = 0; i < res.length; i++) {
              if (feeds[res[i]['feedName']] === undefined) {
                feeds[res[i]['feedName']] = [res[i]['_id'], []];
              }
              feeds[res[i]['feedName']][1].push(res[i]['followee']);
            }

            const feedsList = [];
            for (let key in feeds) {
                feedsList.push({feedName: key, id: feeds[key][0], followees: feeds[key][1]});
            }

            this.feeds = feedsList;
          }
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    },
    created() {
      if (this.$store.state.username) this.getFollowees();
    }, 
    updated() {
      // if (this.$store.state.username) this.getFollowees();
    }
  };
  </script>
  
  <style scoped>
  
  * {
    font-family: Helvetica;
  }
  
  main {
    margin-left: 240px;
    background-color: white;
  }
  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>
  