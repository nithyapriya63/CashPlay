<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <!-- Required container for pages -->
    <q-page-container>
      <!-- QPage must be a direct child of QPageContainer -->
      <q-page class="flex flex-center login-bg">
        <div class="login-box column q-pa-xl shadow-4">
          <div v-if="!otpSent" class="text-h5 text-center q-mb-md">
            <i> Welcome </i>👋
          </div>
          <div v-if="otpSent" class="text-h5 text-center q-mb-md">Login</div>

          <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email"
              type="email"
              filled
              :disable="otpSent"
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Invalid email',
              ]"
            >
              <template v-slot:append>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input
              v-if="otpSent"
              v-model="otp"
              label="Enter OTP"
              type="text"
              maxlength="4"
              filled
              :rules="[(val) => !!val || 'OTP is required']"
            >
              <template v-slot:append>
                <q-icon name="vpn_key" />
              </template>
            </q-input>

            <div v-if="otpSent" class="text-center">
              <div v-if="!canResend">
                Resend OTP in
                <b
                  >{{ Math.floor(timer / 60) }}:{{
                    (timer % 60).toString().padStart(2, "0")
                  }}</b
                >
              </div>
              <q-btn
                v-if="canResend"
                label="Resend OTP"
                color="primary"
                flat
                @click="resendOtp"
              />
            </div>
            <q-btn
              v-if="!otpSent"
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
            />
            <q-btn
              v-if="otpSent && !canResend"
              label="Verify OTP"
              type="submit"
              color="primary"
              class="full-width"
            />
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/authStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const $q = useQuasar();
const authStore = useAuthStore();
const { email, otpSent } = storeToRefs(authStore);
const router = useRouter();

// const email = ref("");
const otp = ref("");
const timer = ref(0); // countdown in seconds
const interval = ref(null);
const canResend = ref(false);

// Start 2-minute countdown (120 seconds)
const startTimer = () => {
  timer.value = 120;
  canResend.value = false;

  interval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval.value);
      canResend.value = true;
    }
  }, 1000);
};

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});
const sendOtp = async () => {
  try {
    await authStore.registerUser(email.value);
    otp.value = "";
    otpSent.value = true;
    $q.notify({ type: "positive", message: "OTP sent to email." });
    startTimer();
  } catch (err) {
    $q.notify({ type: "negative", message: err });
  }
};

const resendOtp = async () => {
  try {
    await authStore.registerUser(email.value);
    otp.value = "";
    otpSent.value = true;
    $q.notify({ type: "positive", message: "OTP resent successfully." });
    startTimer();
  } catch (err) {
    $q.notify({ type: "negative", message: err });
  }
};

const submitForm = async () => {
  try {
    if (!otpSent.value) {
      await sendOtp();
    } else {
      await authStore.loginUser(otp.value);
      $q.notify({ type: "positive", message: "Login successful!" });

      // Let the navigation guard handle redirection
      router.replace({ name: "entries" });
    }
  } catch (err) {
    $q.notify({ type: "negative", message: err });
  }
};
</script>
<style scoped>
.login-bg {
  min-height: 100vh;
}

.login-box {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(120deg, #a8f3c4 0%, #7ec1e2 100%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
}
</style>
