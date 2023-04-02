<template>
  <div
    style="
      height: 85vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    "
  >
    <div class="row">
      <v-overlay :value="connecting" color="rgba(250, 250, 250, 0.9)">
        <v-progress-circular
          indeterminate
          size="64"
          color="#F15921"
          width="7"
          style="width: 100%"
        >
        </v-progress-circular>
        <p style="color: black">Connecting....</p>
      </v-overlay>
      <div class="col-md-6">
        <div class="card box box-agent" :class="[agentVoiceUp]" ref="box-agent">
          <img
            class="card-img-top"
            width="350px"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Card image cap"
          />
          <div class="card-body">
            <p class="card-text">BNI Life</p>
          </div>
        </div>
        <!-- <v-btn @click="callMe()">Call Me</v-btn> -->
      </div>
      <div class="col-md-6">
        <div class="card box box-customer" :class="[custVoiceUp]" ref="box-customer">
          <img
            class="card-img-top"
            width="350px"
            src="https://pixlok.com/wp-content/uploads/2022/02/Profile-Icon-SVG-09856789.png"
            alt="Card image cap"
          />
          <div class="card-body">
            <p class="card-text">Customer {{call.number}}</p>
          </div>
        </div>
        <!-- <v-btn @click="callMe()">Call Me</v-btn> -->
      </div>
      <!-- <div class="col-md-4">
        <v-btn @click="receiveMe()">Receive Me</v-btn>
      </div> -->
      <div class="col-md-3"></div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="control-box">
          <p class="mb-0">{{ totalMinutes }}:{{ totalSeconds }}</p>
          <div class="vl"></div>
          <div class="control-call">
            <button class="btn pause" @click="togglePause()">
              <v-icon color="red"> mdi-microphone-off </v-icon>
            </button>
            <button class="btn hangup" @click="hangupCall()">
              <v-icon color="white"> mdi-phone-hangup </v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="setupDevicesDialog" width="500">
      <v-card tile>
        <v-card-title class="text-h5 lighten-2 title-orange">
          Confirm Call
        </v-card-title>
        <br />
        <v-card-text>
          Kamu akan menguhubungi customer dengan nomor : {{ call.number }}
          <!-- <v-select
            :items="devices.mic"
            item-text="label"
            item-value="deviceId"
            placeholder="Pilih Devices"
            dense
            outlined
            class="investment_type_option"
            v-model="devices.selectedMic"
            @input="setSelectedMic"
          ></v-select> -->
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
            Tidak
          </v-btn>
          <v-btn
            color="#F7931D"
            style="color: #f7931d !important"
            text
            @click="applyDevice"
          >
            Ya
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
      agentVoiceUp: "",
      custVoiceUp: "",
      setupDevicesDialog: true,
      totalSeconds: "00",
      totalMinutes: "00",
      connecting: false,
      devices: {
        selectedMic: null,
        selectedCamera: null,
        defaultMic: null,
        defaultCamera: null,
        mic: [],
        camera: [],
      },
      currentSeconds: 0,
      counter: null,
      call: {
        event: null,
        token: null,
        number: "",
      },
    };
  },
  mounted() {
    this.call.number = this.$route.query.number;
    // this.loadDevices();
  },
  methods: {
    hangUp: async function () {},
    toggleMuteAudio: async function () {},
    getToken: async function () {
      const response = await this.$axios
        .$get("/api/v1/generate-token", {
          headers: {
            "Content-Type": `application/json`,
          },
        })
        .then((response) => {
          if (response.success == 1) {
            this.token = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR");
        });

      return response;
    },
    callMe: async function () {
      await this.getToken();
      const token = this.token;
      const self = this;
      const device = new Device(token, {
        logLevel: 1,
        codecPreferences: ["opus", "pcmu"],
      });
      // device.audio.speakerDevices.set(this.devices.defaultMic);
      // device.audio.ringtoneDevices.set(this.devices.defaultMic);
      this.call.event = await device.connect({
        params: { To: this.call.number },
      });
      // console.log(device.calls, call);
      self.call.event.on("accept", function (call) {
        console.log("===accept====");
        console.log(call);
        self.counter = setInterval(() => {
          self.setTime();
        }, 1000);
        call.on("volume", function(inputVolume, outputVolume){
          console.log("===INPUT VOLUME===" , inputVolume)
          if(inputVolume > 0.2){
            self.agentVoiceUp = "voice-up";
          }else{
            self.agentVoiceUp = "";
          }
          console.log("===OUTPUT VOLUME===" , outputVolume)
          if(outputVolume > 0.2){
            self.custVoiceUp = "voice-up";
          }else{
            self.custVoiceUp = "";
          }
        })
        self.connecting = false;
      });
      self.call.event.on("disconnect", function (call) {
        console.log("===disconnect====");
        clearInterval(self.counter);
      });
      self.call.event.on("cancel", function (call) {
        console.log("===cancel====");
        console.log(call);
        clearInterval(self.counter);
      });
    },
    hangupCall: async function () {
      this.call.event.disconnect();
      clearInterval(this.counter);
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
            (device) => device.kind === "audiooutput"
          );
        })
        .catch((err) => {
          alert("Error ", err);
        });
    },
    setTime: function () {
      this.currentSeconds += 1;
      this.totalSeconds = this.pad(this.currentSeconds % 60);
      this.totalMinutes = this.pad(parseInt(this.currentSeconds / 60));
      console.log("seconds " + this.totalSeconds);
      console.log("minutes " + this.totalMinutes);
    },
    pad: function (val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    },
    setSelectedMic: function (device_id) {
      this.devices.selectedMic = device_id;
    },
    applyDevice: function () {
      this.devices.defaultMic = this.devices.selectedMic;
      this.setupDevicesDialog = false;
      this.connecting = true;
      this.callMe();
    },
  },
};
</script>
<style lang="scss" scoped>
.btn.hangup {
  padding: 10px;
  border-radius: 50%;
  background: red;
}
.btn.pause {
  padding: 10px;
  border-radius: 50%;
  background: white;
  margin-right: 10px;
}
.vl {
  border-left: 2px solid rgb(248, 252, 248);
  height: calc(100% + 2px);
  margin: 0 10px;
}
.control-call {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}
.control-box {
  display: flex;
  background-color: rgb(100, 100, 100);
  width: 250px;
  height: 60px;
  border-radius: 10px;
  margin: auto;
  align-items: center;
  padding: 10px;
}
.btn-white {
  background: #eeeeee;
}
.box {
  padding: 10px;
}
.voice-up{
  border: 5px solid rgb(5, 110, 110);
}
.box-customer {
  background: wheat;
}
.box-agent {
  background: rgb(238, 163, 25);
}
.card {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
