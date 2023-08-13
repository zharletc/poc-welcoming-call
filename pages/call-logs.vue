<template>
  <div>
    <h1>Call Logs</h1>
    <RecordingsTable :recordings="recordings" />
  </div>
</template>

<script>
import RecordingsTable from '../components/RecordingTable.vue';
export default {
  components: {
    RecordingsTable
  },
  mounted() {
    this.getRecordings();
  },
  data() {
    return {
      recordings: []
    };
  },
  methods: {
    // You can implement the logic to fetch recordings here
    // and display them in the RecordingsTable component.
    getRecordings: async function () {
      const response = await this.$axios
        .$get("/api/v1/recordings", {
          headers: {
            "Content-Type": `application/json`,
          },
        })
        .then((response) => {
          if (response.success == 1) {
            this.recordings = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR");
        });

      return response;
    },
  }
};
</script>
