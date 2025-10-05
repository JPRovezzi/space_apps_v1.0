<template>
  <div v-if="show" class="color-modal-overlay" @click="$emit('close')">
    <div class="color-modal" @click.stop>
      <div class="color-modal-header">
        <h3>Seleccionar Color de Fondo</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="color-modal-body">
        <!-- Rueda de colores -->
        <div class="color-wheel-container">
          <div class="color-wheel">
            <canvas
              ref="colorWheel"
              width="200"
              height="200"
              @mousedown="startColorPick"
              @mousemove="updateColorPick"
              @mouseup="endColorPick"
            ></canvas>
            <div
              class="color-indicator"
              :style="{ left: indicatorX + 'px', top: indicatorY + 'px' }"
            ></div>
          </div>
          <div
            class="color-preview"
            :style="{ backgroundColor: selectedColor }"
          ></div>
        </div>

        <!-- Inputs RGB -->
        <div class="color-inputs">
          <div class="input-group">
            <label>R:</label>
            <input
              type="number"
              min="0"
              max="255"
              v-model.number="rgb.r"
              @input="updateColorFromRGB"
            />
          </div>
          <div class="input-group">
            <label>G:</label>
            <input
              type="number"
              min="0"
              max="255"
              v-model.number="rgb.g"
              @input="updateColorFromRGB"
            />
          </div>
          <div class="input-group">
            <label>B:</label>
            <input
              type="number"
              min="0"
              max="255"
              v-model.number="rgb.b"
              @input="updateColorFromRGB"
            />
          </div>
        </div>

        <!-- Input HEX -->
        <div class="hex-input">
          <label>HEX:</label>
          <input
            type="text"
            v-model="hexColor"
            @input="updateColorFromHEX"
            placeholder="#000000"
          />
        </div>

        <!-- Botones -->
        <div class="modal-actions">
          <button class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button class="btn-primary" @click="applyColor">Aplicar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorPickerModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "color-selected"],
  data() {
    return {
      selectedColor: "#ffffff",
      rgb: { r: 255, g: 255, b: 255 },
      hexColor: "#ffffff",
      indicatorX: 100,
      indicatorY: 100,
      isPicking: false,
      canvas: null,
      ctx: null,
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initializeColorWheel();
        });
      }
    },
  },
  methods: {
    initializeColorWheel() {
      this.canvas = this.$refs.colorWheel;
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d");
        this.drawColorWheel();
      }
    },

    drawColorWheel() {
      const centerX = 100;
      const centerY = 100;
      const radius = 90;

      for (let angle = 0; angle < 360; angle++) {
        for (let r = 0; r < radius; r++) {
          const x = centerX + r * Math.cos((angle * Math.PI) / 180);
          const y = centerY + r * Math.sin((angle * Math.PI) / 180);

          // Convertir HSL a RGB
          const hue = angle;
          const saturation = r / radius;
          const lightness = 0.5;

          const rgb = this.hslToRgb(hue / 360, saturation, lightness);
          this.ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          this.ctx.fillRect(x, y, 1, 1);
        }
      }
    },

    hslToRgb(h, s, l) {
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      };
    },

    startColorPick(event) {
      this.isPicking = true;
      this.updateColorPick(event);
    },

    updateColorPick(event) {
      if (!this.isPicking || !this.canvas) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = 100;
      const centerY = 100;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distance <= 90) {
        this.indicatorX = x;
        this.indicatorY = y;

        // Calcular color desde la posición
        const angle = (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
        const hue = (angle + 360) % 360;
        const saturation = distance / 90;
        const lightness = 0.5;

        const rgb = this.hslToRgb(hue / 360, saturation, lightness);
        this.updateColor(rgb);
      }
    },

    endColorPick() {
      this.isPicking = false;
    },

    updateColor(rgb) {
      this.rgb = rgb;
      this.selectedColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      this.hexColor = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    updateColorFromRGB() {
      this.selectedColor = `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
      this.hexColor = this.rgbToHex(this.rgb.r, this.rgb.g, this.rgb.b);
      this.updateIndicatorFromColor();
    },

    updateColorFromHEX() {
      const hex = this.hexColor.replace("#", "");
      if (hex.length === 6) {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          this.rgb = { r, g, b };
          this.selectedColor = `rgb(${r}, ${g}, ${b})`;
          this.updateIndicatorFromColor();
        }
      }
    },

    updateIndicatorFromColor() {
      // Esta función actualizaría la posición del indicador en la rueda
      // Es compleja de implementar, por ahora la dejaremos
    },

    applyColor() {
      this.$emit("color-selected", {
        type: "custom",
        color: this.selectedColor,
      });
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* Modal Styles */
.color-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.color-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.color-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.color-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.color-modal-body {
  padding: 1.5rem;
}

.color-wheel-container {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
}

.color-wheel {
  position: relative;
}

.color-indicator {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border: 2px solid black;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.color-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, 0.2);
}

.color-inputs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: bold;
  color: #555;
  font-size: 0.9rem;
}

.input-group input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
}

.hex-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hex-input label {
  font-weight: bold;
  color: #555;
  min-width: 40px;
}

.hex-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  text-transform: uppercase;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .color-wheel-container {
    flex-direction: column;
    gap: 1rem;
  }

  .color-inputs {
    flex-wrap: wrap;
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
