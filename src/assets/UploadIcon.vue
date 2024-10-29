<template>
  <svg
    style="margin-right: 4px"
    :width="width"
    :height="height"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16ZM8 14C4.692 14 2 11.308 2 8C2 4.692 4.692 2 8 2C11.308 2 14 4.692 14 8C14 11.308 11.308 14 8 14ZM5 6.5C4.53256 7.08254 4.5 7.5 5.5 7.5H6.5V11C6.5 11.5522 7 12.5 7.99955 12.5C8.9991 12.5 9.5 11.5561 9.5 11V7.5H10.5C11.5 7.5 11.465 7.08123 11 6.5C9 4 8.33823 3.35752 8.33823 3.35752C8.15118 3.16007 7.84634 3.15981 7.66247 3.35752C7.66247 3.35752 7.00605 4 5 6.5Z"
      :fill="fill"
    />
  </svg>
</template>

<script>
export default {
  name: "UploadIcon",
  props: {
    width: {
      type: String,
      default: "16",
    },
    height: {
      type: String,
      default: "16",
    },
    fill: {
      type: String,
      default: "white",
    },
  },
};
</script>
