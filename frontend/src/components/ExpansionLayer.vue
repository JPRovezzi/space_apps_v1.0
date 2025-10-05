<template>
  <canvas
    v-if="isActive"
    ref="expansionCanvas"
    :width="width"
    :height="height"
    class="expansion-layer"
    :style="{ opacity: layerOpacity }"
  ></canvas>
</template>

<script>
export default {
  name: "ExpansionLayer",
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    bounds: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    baseColor: {
      type: String,
      default: "#0042A6", // Electric Blue por defecto
    },
    layerOpacity: {
      type: Number,
      default: 100,
    },
    invertScale: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      canvasData: null,
      expansionMatrix: null,
    };
  },
  watch: {
    isActive: {
      handler(newVal) {
        if (newVal && !this.expansionMatrix) {
          this.loadAndRenderExpansionData();
        }
      },
      immediate: false,
    },
    baseColor: {
      handler() {
        if (this.isActive) {
          this.updateCanvas();
        }
      },
    },
    layerOpacity: {
      handler() {
        // La opacidad se maneja via CSS, no necesitamos re-renderizar
      },
    },
    invertScale: {
      handler() {
        if (this.isActive) {
          this.updateCanvas();
        }
      },
    },
  },
  mounted() {
    if (this.isActive && !this.expansionMatrix) {
      this.loadAndRenderExpansionData();
    }
  },
  methods: {
    async loadAndRenderExpansionData() {
      try {
        // Cargar el archivo CSV
        const response = await fetch("/expansion.csv");
        const csvText = await response.text();

        // Parsear CSV a matriz
        this.expansionMatrix = this.parseCSV(csvText);

        // Renderizar en Canvas
        this.renderToCanvas();
      } catch (error) {
        console.error("Error loading expansion data:", error);
      }
    },

    parseCSV(csvText) {
      const lines = csvText.trim().split("\n");
      const matrix = [];

      for (let i = 0; i < lines.length; i++) {
        const values = lines[i].split(",");
        // Saltar la primera columna (Y_0, Y_1, etc.) y convertir a números
        const rowData = values
          .slice(1)
          .map((val) => parseFloat(val.trim()) || 0);
        matrix.push(rowData);
      }

      return matrix;
    },

    renderToCanvas() {
      if (!this.expansionMatrix || !this.$refs.expansionCanvas) return;

      const canvas = this.$refs.expansionCanvas;
      const ctx = canvas.getContext("2d");

      // Crear ImageData para manipulación eficiente de pixels
      const imageData = ctx.createImageData(this.width, this.height);
      const data = imageData.data;

      const rows = this.expansionMatrix.length;
      const cols = this.expansionMatrix[0]?.length || 0;

      if (rows === 0 || cols === 0) return;

      // Encontrar valores min/max para normalización
      let minVal = Infinity;
      let maxVal = -Infinity;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const val = this.expansionMatrix[y][x];
          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
        }
      }

      const valueRange = maxVal - minVal || 1; // Evitar división por cero

      // Renderizar pixel a pixel
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // Convertir coordenadas de pixel a índices de matriz
          const matrixY = Math.floor((y / this.height) * rows);
          const matrixX = Math.floor((x / this.width) * cols);

          if (matrixY < rows && matrixX < cols) {
            const value = this.expansionMatrix[matrixY][matrixX];

            // Normalizar valor (0-1)
            let normalizedValue = (value - minVal) / valueRange;

            // Invertir escala si es necesario
            if (this.invertScale) {
              normalizedValue = 1 - normalizedValue;
            }

            // Calcular color basado en el gradiente
            const color = this.calculateGradientColor(normalizedValue);

            // Establecer pixel en ImageData
            const pixelIndex = (y * this.width + x) * 4;
            data[pixelIndex] = color.r; // R
            data[pixelIndex + 1] = color.g; // G
            data[pixelIndex + 2] = color.b; // B
            data[pixelIndex + 3] = Math.floor(normalizedValue * 255); // A (transparente donde valor = 0)
          }
        }
      }

      // Dibujar ImageData en el canvas
      ctx.putImageData(imageData, 0, 0);
      this.canvasData = true;
    },

    updateCanvas() {
      if (this.expansionMatrix) {
        this.renderToCanvas();
      }
    },

    calculateGradientColor(normalizedValue) {
      // Convertir hex color a RGB
      const hex = this.baseColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Crear gradiente: de blanco/claro (0) a color base oscuro (1)
      const startR = 255;
      const startG = 255;
      const startB = 255;

      const endR = r;
      const endG = g;
      const endB = b;

      // Interpolar entre blanco y color base
      const resultR = Math.round(startR + (endR - startR) * normalizedValue);
      const resultG = Math.round(startG + (endG - startG) * normalizedValue);
      const resultB = Math.round(startB + (endB - startB) * normalizedValue);

      return {
        r: resultR,
        g: resultG,
        b: resultB,
      };
    },
  },
};
</script>

<style scoped>
.expansion-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 50; /* Debajo del contorno pero encima del fondo */
  transition: opacity 0.3s ease;
}
</style>
