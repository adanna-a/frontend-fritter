<template>
  <article
    class="feed"
  >
    <header>
      <div class="top">
        <div>
            {{ feed.feedName }}
        </div>
        <button 
        style="background-color: white; border: 0px;"
        @click="deleteFeed">
          🗑️
        </button>
      </div>
    </header>
    <div v-for="user in feed.followees">
      {{user}}
    </div>
  </article>
</template>

<script>
export default {
  name: 'FeedComponent',
  props: {
    feed: {
      type: Object,
      required: true,
    }
  },
  methods: {
    deleteFeed() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
      };

      this.followee_request(params);
    },
    async followee_request(params) {
      /**
       * Submits a request to the followee's endpoint
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
        console.log(this.feed.feedName)
        const r = await fetch(`/api/followees?feedName=${this.feed.feedName}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.feed {
    padding: 20px;
    margin: 20px;
    width: 700px;
    
    position: relative;
    background-color: white;
    filter: drop-shadow(0px 1px 1px #5e5e5e);
}
header {
  grid-auto-flow: column; 
}
.author {
  font-size: 30px;
  width: 0px;
}

.top {
  grid-auto-flow: column;
}
</style>