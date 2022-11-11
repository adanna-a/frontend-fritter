
<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFolloweeForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/followees',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'followee', label: 'Followee', value: ''},
        {id: 'feedName', label: 'Feed', value: ''},
      ],
      title: 'Follow User',
      callback: () => {
        const message = 'Successfully created a followee!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>