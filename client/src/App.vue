<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form @submit="onSubmit" @reset="onReset" ref="form">
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

          <b-card class="mb-3 text-center">
            <img-file :file="file" v-if="file"></img-file>
            <b-badge pill variant="light">{{ orderId }}</b-badge>
          </b-card>

          <b-form-row class="justify-content-between mb-3">
            <b-col class="flex-grow-0">
              <b-button type="reset" variant="danger">Abbrechen</b-button>
            </b-col>

            <b-col class="flex-grow-0">
              <b-button type="submit" variant="primary">Speichern</b-button>
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
    };
  },

  methods: {
    onSubmit($event) {
      console.log("test", $event);
    },

    onReset() {},
  },
};
</script>
