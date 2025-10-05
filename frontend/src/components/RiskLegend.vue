<template>
  <div v-if="show" class="risk-legend">
    <div class="legend-header">
      <h4>Índice de Riesgo</h4>
    </div>
    <div class="legend-content">
      <div
        class="legend-item"
        v-for="item in orderedLegendItems"
        :key="item.key"
      >
        <div
          class="color-box"
          :style="{ backgroundColor: item.value.color }"
        ></div>
        <span class="value-label">{{
          item.key === "0" || item.key === "99" ? "" : item.key
        }}</span>
        <span class="description">{{ item.value.description }}</span>
      </div>
    </div>
    <div class="legend-footer">
      <small>Escala: 1-10 (valores bajos a altos)</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "RiskLegend",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      legendItems: {
        99: {
          color: "#0042A6",
          description: "Sin dato",
        },
        0: {
          color: "#eafe07",
          description: "No válido",
        },
        1: {
          color: "#f9d7cc",
          description: "",
        },
        2: {
          color: "#f4b39f",
          description: "",
        },
        3: {
          color: "#ef9072",
          description: "",
        },
        4: {
          color: "#eb6c44",
          description: "",
        },
        5: {
          color: "#e64917",
          description: "",
        },
        6: {
          color: "#dc3500",
          description: "",
        },
        7: {
          color: "#cd3100",
          description: "",
        },
        8: {
          color: "#bd2d00",
          description: "",
        },
        9: {
          color: "#ae2900",
          description: "",
        },
        10: {
          color: "#9f2600",
          description: "",
        },
      },
    };
  },
  computed: {
    orderedLegendItems() {
      // Orden personalizado: 1-10, luego No válido (0), luego Sin dato (99)
      const order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 99];
      const ordered = [];

      order.forEach((key) => {
        if (this.legendItems[key] !== undefined) {
          ordered.push({
            key: key.toString(),
            value: this.legendItems[key],
          });
        }
      });

      return ordered;
    },
  },
};
</script>

<style scoped>
.risk-legend {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
  min-width: 180px;
  max-width: 220px;
  font-family: var(--font-body);
  font-size: 0.85rem;
}

.legend-header {
  background: linear-gradient(45deg, #0042a6 0%, #07173f 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px 8px 0 0;
}

.legend-header h4 {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;
}

.legend-content {
  padding: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  gap: 0.5rem;
}

.color-box {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.value-label {
  font-weight: 600;
  color: #1f2937;
  min-width: 20px;
  text-align: center;
  font-size: 0.8rem;
}

.description {
  color: #6b7280;
  font-size: 0.75rem;
  flex: 1;
}

.legend-footer {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 0 0 8px 8px;
  text-align: center;
}

.legend-footer small {
  color: #6b7280;
  font-size: 0.7rem;
}

/* Responsive */
@media (max-width: 768px) {
  .risk-legend {
    min-width: 160px;
    max-width: 200px;
    font-size: 0.8rem;
  }

  .legend-header h4 {
    font-size: 0.85rem;
  }

  .legend-item {
    gap: 0.4rem;
  }

  .color-box {
    width: 14px;
    height: 14px;
  }

  .value-label {
    min-width: 18px;
    font-size: 0.75rem;
  }

  .description {
    font-size: 0.7rem;
  }
}
</style>
