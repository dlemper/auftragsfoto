<template>
  <b-container fluid>
    <b-row>
      <b-col class="mt-2">
        <b-form @submit.prevent="onSubmit" @reset="onReset" ref="form">
          <b-form-group label="Verzeichnis:" label-for="uploadDir">
            <b-input-group>
              <b-form-input
                v-model="config.uploadDir"
                name="uploadDir"
                placeholder="Choose a directory..."
              >
              </b-form-input>
              <b-input-group-append>
                <b-button type="button" variant="secondary" @click="openDialog">
                  <b-icon icon="folder2-open" /> Auswählen
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>

          <b-form-row class="justify-content-between mb-3">
            <b-col>
              <b-button type="reset" variant="danger">
                <b-icon icon="x" />
                Abbrechen
              </b-button>
            </b-col>

            <b-col class="text-right">
              <b-button type="submit" variant="primary">
                <b-icon icon="upload" />
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
export default {
  data() {
    return {
      config: {},
    };
  },

  methods: {
    onSubmit() {
      window.close();
    },

    async onReset() {
      window.close();
    },

    async openDialog() {
      try {
        this.config.uploadDir = await window.ipcRenderer.invoke("open-dialog");
      } catch (e) {
        // ignore
      }
    },
  },

  async mounted() {
    this.config = await window.ipcRenderer.invoke("get-config");
  },
};
</script>
