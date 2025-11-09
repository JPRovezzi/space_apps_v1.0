export default {
  flood: {
    source: 'NASA Worldview',
    layer: 'Global Flood Mortality Risks and Distribution, v1 (2000) → Flood Hazard: Mortality Risk',
    theme: 'Flooding'
  },
  landslide: {
    source: 'NASA Worldview',
    layer: 'Global Landslide Hazard Distribution, v1 (2000) → Landslide Hazard: Frequency and Distribution',
    theme: 'Mass movement processes'
  },
  urban: {
    source: 'NASA Worldview',
    layer: 'GRUMPv1: Urban Extents Grid, v1 (1995) → Urban Extents',
    theme: 'Urban Presence'
  },
  water: {
    source: 'NASA Worldview',
    layer: 'Global 250m Water map (Terra/MODIS, SRTM)',
    theme: 'Presence of Water Bodies and Rivers'
  },
  expansion: {
    source: 'NASA Worldview',
    layer: 'Global Grid of Probabilities of Urban Expansion to 2030, v1 (2000-2030) → Probabilities of Urban Expansion to 2030',
    theme: 'Urban expansion probability'
  },
  risk: {
    source: 'Local Calculation',
    layer: 'Calculated risk: (flood + landslide) × 0.5 × water × (1-urban) × protected_area',
    theme: 'Composite risk index'
  },
  protected: {
    source: 'IGN (National Geographic Institute)',
    layer: 'Protected Area (polygon shape file)',
    theme: 'Presence of Protected Areas'
  }
}
