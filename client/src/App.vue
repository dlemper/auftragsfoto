<template>
  <b-container style="max-width: 34rem">
    <b-row>
      <b-col>
        <b-form @submit.prevent="onSubmit" @reset="onReset" ref="form">
          <b-form-group label="Auftragsnummer:" label-for="order">
            <b-form-input
              v-model="orderId"
              placeholder="1234ABC"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-1"
            label="Auftragsnummer:"
            label-for="input-1"
          >
            <b-form-file
              v-model="file"
              :state="Boolean(file)"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
              browse-text="Foto"
              capture
              accept="image/jpeg"
            >
            </b-form-file>
          </b-form-group>

          <b-card
            class="mb-3 text-center"
            style="min-height: calc(100vh - 16rem)"
          >
            <img-file
              :file="file"
              v-if="file"
              style="max-height: calc(100vh - 20rem)"
            ></img-file>
            <br />
            <b-badge pill variant="light" v-show="orderId"
              >{{ orderId }}.jpg</b-badge
            >
          </b-card>

          <b-form-row class="justify-content-between mb-3">
            <b-col>
              <b-button type="reset" variant="danger">
                <b-icon icon="x" />
                Abbrechen
              </b-button>
            </b-col>

            <b-col class="text-right">
              <b-button
                type="submit"
                variant="primary"
                :disabled="!file || !orderId"
              >
                <b-icon icon="upload" v-show="!isUploading" />
                <b-spinner small v-show="isUploading" />
                Speichern
              </b-button>
            </b-col>
          </b-form-row>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ImgFile from "./components/ImgFile.vue";
export default {
  components: { ImgFile },
  data() {
    return {
      orderId: "",
      file: null,
      isUploading: false,
    };
  },

  methods: {
    onSubmit() {
      if (!this.file || !this.orderId) {
        return;
      }

      this.isUploading = true;

      const formData = new FormData();
      formData.append(
        "file",
        new File([this.file], `${this.orderId}.jpg`, { type: this.file.type })
      );

      await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      this.isUploading = false;
    },

    onReset() {
      this.orderId = "";
      this.isUploading = false;
    },
  },
};
</script>
