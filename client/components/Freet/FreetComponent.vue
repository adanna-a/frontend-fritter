<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <div class="top">
      <div
        style="font-size: 30px; font-weight: 500;"
        class="actions"
      >
      @{{ freet.author }}
        <button
          style="background-color: white; border: 0px;"
          v-if="editing && $store.state.username === freet.author"
          @click="submitEdit"
        >
          ✅ 
        </button>
        <button
          v-if="editing && $store.state.username === freet.author"
          style="background-color: white; border: 0px;"
          @click="stopEditing"
        >
          🚫
        </button>
        <button
          v-if="!editing && $store.state.username === freet.author"
          style="background-color: white; border: 0px;"
          @click="startEditing"
        >
          ✏️
        </button>
        <button 
        v-if="$store.state.username === freet.author"
        style="background-color: white; border: 0px;"
        @click="deleteFreet">
          🗑️
        </button>
      </div>
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
    {{ freet.content }}
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
      style="font-size: 10px; color: grey;"
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
      style="font-size: 10px; color: grey;"
      class="country"
    >
      Country: {{ freet.country }}
    </p>

    <p style="font-size: 10px; color: grey;" class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>

    <button 
      v-if="!liked && $store.state.username"
      style="background-color: white; border: 0px;"
      @click="likeFreet">
      ♡ {{rank}} likes
    </button>
    <button 
      v-if="liked && $store.state.username"
      style="background-color: white; border: 0px;"
      @click="unlikeFreet">
      ❤️ {{rank}} likes
    </button>

    <button
      style="background-color: white; border: 0px;"
      @click="showComments = !showComments">
      💬 {{comments.length}} comments
    </button>
    <div v-if="showComments">
      <section  v-if="$store.state.username">
        <CreateCommentForm
        :freetId=freet._id
        />
      </section>
      <section
          v-if="comments.length"
        >
          <CommentComponent
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
          />
      </section>
      <article
          v-else
        >
          <h3>No Comments, write the first!</h3>
      </article>

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
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';

export default {
  name: 'FreetComponent',
  components: {CommentComponent, CreateCommentForm},
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
      alerts: {}, // Displays success/error messages encountered during freet modification
      showComments: false,
      comments: [],
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
      this.comments = [];
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
    getComments() {
      /**
       * Get the comments for the freet
       */
      const params = {
        method: 'GET',
        callback: () => {}
      };
      this.comment_request(params);
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
          this.$store.commit('refreshFreets');
          params.callback();
        } else if (options.method == 'DELETE') {
          const r = await fetch(`/api/likes/${this.freet._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('refreshFreets');
          params.callback();
       } else if (options.method == 'GET') {
          const r = await fetch(`/api/likes?freetId=${this.freet._id}`, options);
          const res = await r.json();

          if (!r.ok) {
            throw new Error(res.error);
          }
          const likers = [];

          for (var i = 0; i < res['likes'].length; i++) {
            likers.push(res['likes'][i]['author']);
          }
          this.likers = likers;
          this.rank = likers.length;
          
          this.liked = likers.includes(this.$store.state.username);
          params.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async comment_request(params) {
      /**
       * Submits a request to the comments endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };

      try {
        if (options.method == 'GET') {
          const r = await fetch(`/api/comments?freetId=${this.freet._id}`, options);
          const res = await r.json();

          if (!r.ok) {
            throw new Error(res.error);
          }

          const comments = [];

          for (var i = 0; i < res.length; i++) {
            comments.push({author: res[i]['author'], content: res[i]['content'], dateCreated: res[i]['dateCreated'], id:  res[i]['_id'], freetId:  res[i]['freetId']});
          }
          this.comments = comments;
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
  created() {
    this.getLikes();
    this.getComments();
  },
  updated() {
    this.getLikes();
    this.getComments();
  }
};
</script>

<style scoped>
.freet {
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