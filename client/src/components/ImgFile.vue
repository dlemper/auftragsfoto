<template>
  <b-img :src="data" rounded fluid />
</template>

<script>
export default {
  data() {
    return {
      data: "",
    };
  },

  props: {
    file: {
      type: File,
      required: true,
    },
  },

  watch: {
    async file(newValue) {
      this.data = await this.readFileAsDataUrl(newValue);
    },
  },

  methods: {
    readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => resolve(reader.result), false);
        reader.addEventListener("error", () =>
          reject(`Error occurred reading file: ${file.name}`)
        );

        if (file) {
          reader.readAsDataURL(file);
        }
      });
    },
  },

  async mounted() {
    this.data = await this.readFileAsDataUrl(this.file);
  },
};
</script>

<style></style>
