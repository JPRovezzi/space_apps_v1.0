export default {
  flood: {
    source: 'NASA Worldview',
    layer: 'Global Flood Mortality Risks and Distribution, v1 (2000) → Flood Hazard: Mortality Risk',
    theme: 'Inundaciones'
  },
  landslide: {
    source: 'NASA Worldview',
    layer: 'Global Landslide Hazard Distribution, v1 (2000) → Landslide Hazard: Frequency and Distribution',
    theme: 'Procesos de remoción en masa'
  },
  urban: {
    source: 'NASA Worldview',
    layer: 'GRUMPv1: Urban Extents Grid, v1 (1995) → Urban Extents',
    theme: 'Presencia de Urbanización'
  },
  water: {
    source: 'NASA Worldview',
    layer: 'Global 250m Water map (Terra/MODIS, SRTM)',
    theme: 'Presencia de Cuerpos de Agua y Cursos Fluviales'
  },
  expansion: {
    source: 'NASA Worldview',
    layer: 'Global Grid of Probabilities of Urban Expansion to 2030, v1 (2000-2030) → Probabilities of Urban Expansion to 2030',
    theme: 'Probabilidad de expansión urbana'
  },
  risk: {
    source: 'Cálculo Local',
    layer: 'Riesgo calculado: (flood + landslide) × 0.5 × water × (1-urban) × area_protegida',
    theme: 'Índice de riesgo compuesto'
  },
  protected: {
    source: 'IGN (Instituto Geográfico Nacional)',
    layer: 'Área Protegida (archivo shape de polígono)',
    theme: 'Presencia de Áreas Protegidas'
  }
}
