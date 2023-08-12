<template>
  <table>
    <thead>
      <tr>
        <th>Call SID</th>
        <th>Recording SID</th>
        <th>Duration (seconds)</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="recording in recordings" :key="recording.sid">
        <td>{{ recording.callSid }}</td>
        <td>{{ recording.sid }}</td>
        <td>{{ recording.duration }}</td>
        <td>
          <button @click="fetchTranscriptions(recording.callSid)">Detail</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    recordings: Array
  },
  methods: {
    fetchTranscriptions(recordingSid) {
      // You can implement the logic to fetch transcriptions here
      // and display them in another component or modal.
      this.$router.push(`/record/${recordingSid}`);
    }
  }
};
</script>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  color: black;
}

th,
td {
  border: 1px solid silver;
  /* Menambahkan border */
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  /* Background abu-abu muda pada header */
}

td {
  background-color: white;
  /* Background putih pada sel */
  color: black;
  /* Teks berwarna silver */
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
