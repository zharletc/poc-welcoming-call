<template>
  <div>
    <div class="row">
      <div class="col-md-3">
        <v-btn @click="callMe()">Call Me</v-btn>
        <v-btn @click="loadDevices()">Load Devices</v-btn>
      </div>
      <!-- <div class="col-md-4">
        <v-btn @click="receiveMe()">Receive Me</v-btn>
      </div> -->
      <div class="col-md-3"></div>
    </div>
    <v-dialog v-model="setupDevicesDialog" width="500">
      <v-card tile>
        <v-card-title class="text-h5 lighten-2 title-orange">
          Set Default Microphone
        </v-card-title>
        <br />
        <v-card-text>
          Select Microphone
          <v-select
            :items="devices.mic"
            item-text="label"
            item-value="deviceId"
            placeholder="Pilih Devices"
            dense
            outlined
            class="investment_type_option"
            v-model="devices.selectedMic"
            @input="setSelectedMic"
          ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#F7931D"
            style="color: #f7931d !important"
            text
            @click="setupDevicesDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="#F7931D"
            style="color: #f7931d !important"
            text
            @click="applyDevice"
          >
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Device } from "@twilio/voice-sdk";
// import { twiml } from "twilio";
export default {
  name: "IndexPage",
  data() {
    return {
      setupDevicesDialog: false,
      devices: {
        selectedMic: null,
        selectedCamera: null,
        defaultMic: null,
        defaultCamera: null,
        mic: [],
        camera: [],
      },
    };
  },
  mounted() {
    // this.loadDevices();
  },
  methods: {
    callMe: async function () {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzQxMmJjZjE5MDM3ZmE5MWQ2NDExNTMzYzBkZmFlZjZlLTE2Nzk4MzcxODIiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJhemhhcm9naUBnbWFpbC5jb20iLCJ2b2ljZSI6eyJpbmNvbWluZyI6eyJhbGxvdyI6dHJ1ZX0sIm91dGdvaW5nIjp7ImFwcGxpY2F0aW9uX3NpZCI6IkFQZWJhYzc1M2FmMGRhMzM5OTAwZDI3NTZiNTdlMGMzYWUifX19LCJpYXQiOjE2Nzk4MzcxODIsImV4cCI6MTY3OTg0MDc4MiwiaXNzIjoiU0s0MTJiY2YxOTAzN2ZhOTFkNjQxMTUzM2MwZGZhZWY2ZSIsInN1YiI6IkFDNmY2YzJmMGY3MzgzYTI5MjFhNjQ1Yjc3NDk1MjA5ZjIifQ.Y9vfbOazNPa_2DwfQbFjUP0iVesOCS3CAQP9tjp_ODI";
      const device = new Device(token, {
        logLevel: 1,
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions.
        codecPreferences: ["opus", "pcmu"],
      });
      // device.audio.speakerDevices.set(this.devices.defaultMic);
      // device.audio.ringtoneDevices.set(this.devices.defaultMic);

      const call = await device.connect({ params: { To: "+62895369163319" } });
      // // make an ougoing call
      // device.connect({ params: { To: "+6288989543401" } });
      // let twiml = new VoiceResponse();
      // let dial = twiml.dial();
      // dial.client("+62895369163319");
      console.log(device.calls, call);
    },
    receiveMe: async function () {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzQxMmJjZjE5MDM3ZmE5MWQ2NDExNTMzYzBkZmFlZjZlLTE2Nzk2NzY4OTYiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJhemhhcm9naUBnbWFpbC5jb20iLCJ2b2ljZSI6eyJpbmNvbWluZyI6eyJhbGxvdyI6dHJ1ZX0sIm91dGdvaW5nIjp7ImFwcGxpY2F0aW9uX3NpZCI6IkFQZWJhYzc1M2FmMGRhMzM5OTAwZDI3NTZiNTdlMGMzYWUifX19LCJpYXQiOjE2Nzk2NzY4OTYsImV4cCI6MTY3OTY4MDQ5NiwiaXNzIjoiU0s0MTJiY2YxOTAzN2ZhOTFkNjQxMTUzM2MwZGZhZWY2ZSIsInN1YiI6IkFDNmY2YzJmMGY3MzgzYTI5MjFhNjQ1Yjc3NDk1MjA5ZjIifQ.OBqKrVCp7Ai2QnyvSQwbE21_DWYnq0w4lViNhBmoCrU";
      const device = new Device(token);
      // make an ougoing call
      device.on("incoming", (call) => {
        console.log("CALL ME");
        console.log(call);
      });
      console.log(device.calls);
    },
    loadDevices: async function () {
      this.setupDevicesDialog = true;
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          this.devices.mic = devices.filter(
            (device) => device.kind === "audioinput"
          );
        })
        .catch((err) => {
          alert("Error ", err);
        });
    },
    setSelectedMic: function (device_id) {
      this.devices.selectedMic = device_id;
    },
    applyDevice: function () {
      this.devices.defaultMic = this.devices.selectedMic;
      this.setupDevicesDialog = false;
      console.log(this.devices.defaultMic);
    },
  },
};
</script>
