<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <div v-if="editing">Content:</div>
    <textarea
      v-if="editing"
      class="content"
      :value="draftContent"
      @input="draftContent = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
    Content: {{ freet.content }}
    </p>
    
    <div v-if="editing">Topic:</div>
    <textarea
      v-if="editing"
      class="topic"
      :value="draftTopic"
      @input="draftTopic = $event.target.value"
    />
    <p
      v-else
      class="topic"
    >
      Topic: {{ freet.topic }}
    </p>
    <div v-if="editing">Country:</div>
    <textarea
      v-if="editing"
      class="country"
      :value="draftCountry"
      @input="draftCountry = $event.target.value"
    />
    <p
      v-else
      class="country"
    >
      Country: {{ freet.country }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <button 
      v-if="!liked"
      @click="likeFreet">
      ❤️ Like
    </button>
    <button 
      v-else
      @click="unlikeFreet">
      💔 Unlike
    </button>
    <div>
      Likes: {{rank}}
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draftContent: this.freet.content, // Potentially-new content for this freet
      draftTopic: this.freet.topic,
      draftCountry: this.freet.country,
      liked: false,
      rank: 0,
      likers: [],
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draftContent = this.freet.content; // The content of our current "draft" while being edited
      this.draftTopic = this.freet.topic;
      this.draftCountry = this.freet.country;
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draftContent = this.freet.content; 
      this.draftTopic = this.freet.topic;
      this.draftCountry = this.freet.country;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
      };
      this.freet_request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draftContent && this.freet.topic === this.draftTopic && this.freet.country === this.draftCountry) {
        const error = 'Error: Edited freet content, topic, or country should be different than previously.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draftContent, topic: this.draftTopic, country: this.draftCountry}),
        callback: () => {}
      };
      this.freet_request(params);
    },
    likeFreet() {
      /**
       * Likes this freet
       */
       const params = {
        method: 'POST',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {}
      };
      this.like_request(params);
    },
    unlikeFreet() {
      /**
       * Likes this freet
       */
      const params = {
        method: 'DELETE',
        callback: () => {}
      };
      this.like_request(params);
    },
    getLikes() {
      /**
       * Get the likes for the freet
       */
      const params = {
        method: 'GET',
        callback: () => {}
      };
      this.like_request(params);
    },
    async freet_request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async like_request(params) {
      /**
       * Submits a request to the like's endpoint
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
        if (options.method == 'POST') {
          const r = await fetch(`/api/likes`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.editing = false;
          this.$store.commit('refreshFreets');
          params.callback();
        } else if (options.method == 'DELETE') {
          const r = await fetch(`/api/likes/${this.freet._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.editing = false;
          this.$store.commit('refreshFreets');
          params.callback();
       } else if (options.method == 'GET') {
          const r = await fetch(`/api/likes?freetId=${this.freet._id}`, options);
          const res = await r.json();

          if (!r.ok) {
            throw new Error(res.error);
          }
          this.editing = false;

          const likers = [];

          for (var i = 0; i < res['likes'].length; i++) {
            console.log('in this right here!!');
            console.log(res['likes']);
            likers.push(res['likes'][i]['author']);
          }
          this.likers = likers;
          this.rank = likers.length;
          
          this.liked = likers.includes(this.$store.state.username);
          console.log('this.likers:', this.likers, '\n', 'this.rank:' , this.rank, '\n', 'this.liked:', this.liked);
          console.log(this.likers);
          params.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  created() {
    this.getLikes();
  },
  updated() {
    this.getLikes();
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
