<template>
  <div>
    <h1>Recording Detail</h1>
    <div class="detail">
      <div><strong>Status:</strong> {{ recordings ? recordings.recording.status : '-' }}</div>
      <div><strong>Duration:</strong> {{ recordings ? recordings.recording.duration + "s" : '-' }}</div>
      <br>
      <template v-if="recordings">
        <audio controls>
          <source :src="recordings.recording.mediaUrl" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </template>

    </div>
    <h2>Transcriptions</h2>
    <template v-if="recordings">
      <div v-for="(transcription, index) in recordings.sentences" :key="index">
        <div :class="{ 'transcription agent': transcription.actor === 'agent', 'transcription client': transcription.actor === 'customer' }">
          <p style="font-weight: bold; margin-bottom: 2px;">
            {{ transcription.actor === 'agent' ? 'Agent' : 'Customer' }}
          </p>
          <div :class="{ 'agent': transcription.actor === 'agent', 'client': transcription.actor === 'customer' }">
            {{ transcription.text }}
          </div>
        </div>

      </div>
    </template>

  </div>
</template>

<script>
export default {
  data() {
    return {
      recordings: null, // Fill this with actual recording data
      transcriptions: [] // Fill this with actual transcriptions data
    };
  },
  mounted() {
    this.getRecording();
  },
  methods: {
    // You can implement the logic to fetch recordings here
    // and display them in the RecordingsTable component.
    getRecording: async function () {
      const recordingSid = this.$route.params.id;
      const response = await this.$axios
        .$get(`/api/v1/recordings/${recordingSid}`, {
          headers: {
            "Content-Type": `application/json`,
          },
        })
        .then((response) => {
          if (response.success == 1) {
            this.recordings = response.data;
            console.log(response.data);
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

<style scoped>
.detail {
  margin-bottom: 20px;
}

.transcription.client {
  margin-bottom: 10px;
  padding: 10px;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  background-color: #38A6B4;
}

.transcription.agent {
  margin-bottom: 10px;
  padding: 10px;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  background-color: #ECB419FB;
}

.agent {
  background-color: #CEAD1A;
  /* color: #0066cc; */
  padding: 10px;
  border-radius: 5px;
}

.client {
  background-color: #64CCEC;
  /* color: #333; */
  padding: 10px;
  border-radius: 5px;
}
</style>
