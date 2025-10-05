<template>
  <svg
    :width="width"
    :height="height"
    class="cordoba-contour"
    ref="svgRef"
  ></svg>
</template>

<script>
import * as d3 from "d3";
import contourData from "@/assets/data/contorno-cba.js";

export default {
  name: "CordobaContour",
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
    background: {
      type: String,
      default: "marble",
    },
  },
  data() {
    return {
      svg: null,
    };
  },
  computed: {
    strokeColor() {
      return this.background === "night" ? "#0960e1" : "#000000";
    },
  },
  watch: {
    background: {
      handler() {
        // Actualizar el color de los paths existentes cuando cambia el background
        if (this.svg) {
          this.svg.selectAll("path").attr("stroke", this.strokeColor);
        }
      },
      immediate: false,
    },
  },
  mounted() {
    this.initializeSvg();
    this.renderContour();
  },
  beforeUnmount() {
    if (this.svg) {
      // Limpiar recursos D3
      this.svg.selectAll("*").remove();
    }
  },
  methods: {
    initializeSvg() {
      this.svg = d3.select(this.$refs.svgRef);
    },

    // Función para transformar coordenadas geográficas a coordenadas de pixel
    geoToPixel(lat, lon) {
      const latRange = this.bounds.MAX_LAT - this.bounds.MIN_LAT;
      const lonRange = this.bounds.MAX_LON - this.bounds.MIN_LON;

      // Transformar coordenadas
      const x = ((lon - this.bounds.MIN_LON) / lonRange) * this.width;
      const y = ((this.bounds.MAX_LAT - lat) / latRange) * this.height; // Invertir Y

      return [x, y];
    },

    renderContour() {
      if (!this.svg || !contourData) return;

      // Crear generador de paths
      const lineGenerator = d3.line().curve(d3.curveLinear);

      // Procesar cada feature del GeoJSON
      contourData.features.forEach((feature) => {
        if (feature.geometry.type === "MultiPolygon") {
          // Procesar cada polígono del MultiPolygon
          feature.geometry.coordinates.forEach((polygon) => {
            // Procesar cada anillo del polígono
            polygon.forEach((ring) => {
              // Transformar coordenadas geográficas a pixels [lon, lat] -> [lat, lon] para geoToPixel
              const pixelCoordinates = ring.map(([lon, lat]) =>
                this.geoToPixel(lat, lon)
              );

              // Crear path SVG
              this.svg
                .append("path")
                .datum(pixelCoordinates)
                .attr("d", lineGenerator)
                .attr("fill", "none")
                .attr("stroke", this.strokeColor)
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "0.9")
                .attr("vector-effect", "non-scaling-stroke");
            });
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.cordoba-contour {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 100;
}
</style>
