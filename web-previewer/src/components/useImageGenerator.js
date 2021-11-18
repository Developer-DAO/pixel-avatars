import { ref, watch } from "vue";

const SRC_IMG_WIDTH = 3659;
const SRC_IMG_HEIGHT = 4734;

export default function useImageGenerator(state) {
  const src = ref("");

  function loadImage(src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        resolve(image);
      };
    });
  }

  function drawCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = SRC_IMG_WIDTH;
    canvas.height = SRC_IMG_HEIGHT;

    const ctx = canvas.getContext("2d", { alpha: true });
    const operations = [];
    state.layers.value.forEach((layer) => {
      operations.push(loadImage(layer));
    });

    if (state.computer.value) {
      operations.push(loadImage(`/traits/computer.png`));
    }

    Promise.all(operations).then((images) => {
      images.forEach((img) => {
        ctx.drawImage(img, 0, 0, SRC_IMG_WIDTH, SRC_IMG_HEIGHT);
      });
      src.value = canvas.toDataURL("image/png");
    });
  }

  watch([state.layers, state.computer], drawCanvas);

  drawCanvas();

  return src;
}
