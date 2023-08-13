<template>
  <div>
    <h1>Call & Recording Information</h1>
    <div v-if="loading">
      <div><strong><i>Loading Data...</i></strong></div>
    </div>
    <div v-else>
      <div class="detail">
        <div style=" margin-top: 20px; margin-bottom: 20px;">
          <div>
            <div><strong>Dialer:</strong> {{ recordings ? recordings.call.from : '-' }}</div>
            <div><strong>To Number:</strong> {{ recordings ? recordings.call.to : '-' }}</div>
            <div><strong>Status:</strong> {{ recordings ? recordings.recording.status : '-' }}</div>
            <div><strong>Call Duration:</strong> {{ recordings ? recordings.call.duration + "s" : '-' }}</div>
            <div><strong>Start Call:</strong> {{ recordings ? $moment(recordings.recording.startTime).format("DD MMM YYYY HH:mm:s") : '-'  }}</div>
            <div><strong>End Call:</strong> {{ recordings ? $moment(recordings.recording.startTime).add(recordings.recording.duration, 'seconds').format("DD MMM YYYY HH:mm:s") : '-'  }}</div>
          </div>
          <div style=" margin-top: 20px;">
            <div><strong>Record Duration:</strong> {{ recordings ? recordings.recording.duration + "s" : '-' }}</div>
          </div>
        </div>
        <template v-if="recordings">
          <audio controls>
            <source :src="recordings.recording.mediaUrl" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </template>

      </div>
      <!-- <h2>Transcriptions</h2>
      <template v-if="recordings">
        <div v-for="(transcription, index) in recordings.sentences" :key="index">
          <div
            :class="{ 'transcription agent': transcription.actor === 'agent', 'transcription client': transcription.actor === 'customer' }">
            <p style="font-weight: bold; margin-bottom: 2px;">
              {{ transcription.actor === 'agent' ? 'Agent' : 'Customer' }}
            </p>
            <div :class="{ 'agent': transcription.actor === 'agent', 'client': transcription.actor === 'customer' }">
              {{ transcription.text }}
            </div>
          </div>

        </div>
      </template> -->
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      recordings: null, // Fill this with actual recording data
      transcriptions: [] // Fill this with actual transcriptions data
    };
  },
  mounted() {
    this.getRecording();
    // this.loading = false;
  },
  methods: {
    // You can implement the logic to fetch recordings here
    // and display them in the RecordingsTable component.
    getRecording: async function () {
      this.loading = true;
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
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR");
          this.loading = false;
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
