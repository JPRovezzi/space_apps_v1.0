"""
SCRIPT DE CÁLCULO DE RIESGO DE DESASTRES NATURALES - NASA SPACE APPS CHALLENGE
===============================================================================

DESCRIPCIÓN GENERAL:
------------------
Este script calcula el mapa de riesgo de desastres naturales (inundaciones y deslizamientos)
para la provincia de Córdoba, Argentina, combinando múltiples factores ambientales.

ARCHIVOS DE ENTRADA REQUERIDOS:
-------------------------------
1. flood.csv - Mapa de susceptibilidad a inundaciones (valores 0-10)
2. landslide.csv - Mapa de susceptibilidad a deslizamientos (valores normalizados 1-10)
3. water.csv - Mapa de cuerpos de agua (valores 0-1)
4. urban.csv - Mapa de áreas urbanas (valores 0-1)
5. pixeles_areas_protegidas.csv - Mapa binario de áreas protegidas (0=no protegida, 1=protegida)

FÓRMULA DE CÁLCULO:
-------------------
Riesgo = (flood + landslide) × 0.5 × water × (1 - urban) × area_protegida

EXCEPCIONES ESPECIALES:
----------------------
- Si flood = 0 y [water × (1-urban) × area_protegida ≠ 0], entonces Riesgo = 99 (sin dato)
- Valores 99 se muestran en color Electric Blue (#0042A6)
- Valores 0 se muestran en color Neon Yellow (#eafe07)

ESCALA DE COLORES:
-----------------
- 0: Neon Yellow (riesgo mínimo)
- 1-10: Gradiente Rocket Red (de claro a oscuro según intensidad)
- 99: Electric Blue (sin dato)

ARCHIVOS DE SALIDA GENERADOS:
-----------------------------
1. riesgo.csv - Matriz de riesgo calculada
2. riesgo.jpeg - Imagen visual del mapa de riesgo
3. riesgo_scale.json - Metadatos con información de colores y configuración

CONSIDERACIONES TÉCNICAS:
-----------------------
- Todas las matrices deben tener las mismas dimensiones
- Los cálculos se realizan de forma vectorizada para optimización
- Los valores NaN se convierten a 99 (sin dato) en la visualización
- La imagen JPEG se genera con alta calidad (95%) y resolución configurable

DEPENDENCIAS:
-------------
- pandas: Para manejo de datos CSV
- numpy: Para operaciones vectorizadas
- matplotlib: Para generación de imágenes
- json: Para exportar metadatos

USO:
----
python calcular_riesgo.py

AUTOR: NASA Space Apps Challenge - Córdoba Team
"""

import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import json

def normalizar_valores(valores, rango_min=1, rango_max=10):
    """
    Normaliza los valores al rango especificado [rango_min, rango_max]
    """
    min_actual = np.min(valores)
    max_actual = np.max(valores)

    if max_actual == min_actual:
        # Si todos los valores son iguales, devolver el valor medio del rango
        return np.full_like(valores, (rango_min + rango_max) / 2)

    # Fórmula de normalización: nuevo = rango_min + ((valor - min_actual) / (max_actual - min_actual)) * (rango_max - rango_min)
    return rango_min + ((valores - min_actual) / (max_actual - min_actual)) * (rango_max - rango_min)

def calcular_riesgo():
    """
    Calcula el riesgo aplicando la fórmula: (flood + landslide_normalizado) * (1/2) * water * (1-urban) * area_protegida
    Con excepción: Si water * (1-urban) * area_protegida != 0 y flood = 0, entonces valor = 99

    Los valores de flood ya están en rango correcto (0-10), landslide se normaliza al rango 1-10.
    """

    # Leer los archivos CSV
    print("Leyendo archivos CSV...")

    try:
        flood_df = pd.read_csv('flood.csv', header=None)
        landslide_df = pd.read_csv('landslide.csv', header=None)
        water_df = pd.read_csv('water.csv', header=None)
        urban_df = pd.read_csv('urban.csv', header=None)
        area_protegida_df = pd.read_csv('pixeles_areas_protegidas.csv', header=None)

        print("Archivos leídos correctamente")
        print(f"Dimensiones flood: {flood_df.shape}")
        print(f"Dimensiones landslide: {landslide_df.shape}")
        print(f"Dimensiones water: {water_df.shape}")
        print(f"Dimensiones urban: {urban_df.shape}")
        print(f"Dimensiones area_protegida: {area_protegida_df.shape}")

    except Exception as e:
        print(f"Error al leer los archivos CSV: {str(e)}")
        return

    # Convertir a arrays numpy para operaciones vectorizadas
    flood = flood_df.values.astype(float)
    landslide = landslide_df.values.astype(float)
    water = water_df.values.astype(float)
    urban = urban_df.values.astype(float)
    area_protegida = area_protegida_df.values.astype(float)

    # Flood ya está en el rango correcto (0-10), normalizar landslide al rango 1-10 para poder sumarlos
    print("Flood ya está en rango correcto (0-10), normalizando landslide al rango 1-10...")
    landslide_normalizado = normalizar_valores(landslide, 1, 10)

    print(f"Flood: {np.min(flood):.1f} - {np.max(flood):.1f} (sin normalizar)")
    print(f"Landslide: {np.min(landslide):.1f} - {np.max(landslide):.1f} → {np.min(landslide_normalizado):.1f} - {np.max(landslide_normalizado):.1f}")

    # Usar flood sin normalizar y landslide normalizado
    landslide = landslide_normalizado

    # Calcular el riesgo
    print("Calculando riesgo...")

    # Verificar y ajustar dimensiones de matrices (usar la matriz más chica si hay discrepancias)
    matrices_to_check = [
        ('flood', flood),
        ('landslide', landslide),
        ('water', water),
        ('urban', urban),
        ('area_protegida', area_protegida)
    ]

    # Encontrar las dimensiones mínimas
    min_rows = min(matrix.shape[0] for _, matrix in matrices_to_check)
    min_cols = min(matrix.shape[1] for _, matrix in matrices_to_check)

    print(f"Dimensiones objetivo (mínimas): {min_rows} x {min_cols}")

    # Recortar todas las matrices a las dimensiones mínimas
    for i, (name, matrix) in enumerate(matrices_to_check):
        if matrix.shape != (min_rows, min_cols):
            print(f"Recortando matriz '{name}' de {matrix.shape} a ({min_rows}, {min_cols})")
            matrix = matrix[:min_rows, :min_cols]
            # Actualizar la variable correspondiente
            if name == 'flood':
                flood = matrix
            elif name == 'landslide':
                landslide = matrix
            elif name == 'water':
                water = matrix
            elif name == 'urban':
                urban = matrix
            elif name == 'area_protegida':
                area_protegida = matrix

    print("✓ Todas las matrices ajustadas a dimensiones consistentes")

    # Inicializar array de riesgo con ceros
    riesgo = np.zeros_like(flood)

    # Calcular water * (1-urban) * area_protegida
    notvalid_factor = water * (1 - urban) * area_protegida

    # Aplicar la fórmula principal
    riesgo = (flood + landslide) * 0.5 * notvalid_factor

    # Aplicar la excepción: Si water * (1-urban) * area_protegida != 0 y flood = 0, entonces 99 (sin dato)
    # (flood = 0 indica valor mínimo/nulo)
    mask_excepcion = (notvalid_factor != 0) & (flood == 0.0)
    riesgo[mask_excepcion] = 99

    # Verificar rangos válidos
    print("Verificando rangos de valores válidos...")

    flood_valid = np.all((flood >= 0) & (flood <= 10))
    landslide_valid = np.all((landslide >= 1) & (landslide <= 10))

    if not flood_valid:
        flood_min = np.min(flood)
        flood_max = np.max(flood)
        print(f"Advertencia: flood tiene valores fuera del rango válido [0-10]. Min: {flood_min}, Max: {flood_max}")

    if not landslide_valid:
        landslide_min = np.min(landslide)
        landslide_max = np.max(landslide)
        print(f"Advertencia: landslide tiene valores fuera del rango válido [1-10]. Min: {landslide_min}, Max: {landslide_max}")

    # Estadísticas del resultado
    riesgo_min = np.min(riesgo)
    riesgo_max = np.max(riesgo)
    riesgo_mean = np.mean(riesgo)

    print("Estadísticas del riesgo calculado:")
    print(f"  Mínimo: {riesgo_min}")
    print(f"  Máximo: {riesgo_max}")
    print(f"  Promedio: {riesgo_mean:.4f}")

    # Contar valores especiales
    count_99 = np.sum(riesgo == 99)
    count_zero = np.sum(riesgo == 0)

    print(f"  Valores 99 (excepción): {count_99}")
    print(f"  Valores 0: {count_zero}")

    # Guardar el resultado
    print("Guardando resultado en riesgo.csv...")

    # Convertir de vuelta a DataFrame para guardar como CSV
    riesgo_df = pd.DataFrame(riesgo)

    # Guardar sin índices ni headers
    riesgo_df.to_csv('riesgo.csv', index=False, header=False)

    print("¡Cálculo completado! Archivo 'riesgo.csv' generado.")
    print(f"Dimensiones del archivo de salida: {riesgo_df.shape}")

    # Crear imagen JPEG del resultado
    crear_jpeg_riesgo(riesgo)

def lighten_color(color, factor=0.5):
    """
    Aclara un color mezclándolo con blanco.
    factor=0.5 significa 50% blanco + 50% color original
    """
    # Convertir hex a RGB
    color = color.lstrip('#')
    r, g, b = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))

    # Mezclar con blanco
    r_light = int(r + (255 - r) * factor)
    g_light = int(g + (255 - g) * factor)
    b_light = int(b + (255 - b) * factor)

    return f'#{r_light:02x}{g_light:02x}{b_light:02x}'

def darken_color(color, factor=0.5):
    """
    Oscurece un color mezclándolo con negro.
    factor=0.5 significa 50% negro + 50% color original
    """
    # Convertir hex a RGB
    color = color.lstrip('#')
    r, g, b = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))

    # Mezclar con negro
    r_dark = int(r * (1 - factor))
    g_dark = int(g * (1 - factor))
    b_dark = int(b * (1 - factor))

    return f'#{r_dark:02x}{g_dark:02x}{b_dark:02x}'

def create_risk_colormap():
    """
    Crea un colormap personalizado para el riesgo usando Rocket Red.
    Los valores más altos tienen colores más intensos (oscuros).
    Se usa para valores 1-10. El valor 0 es Neon Yellow, el 99 es Electric Blue.
    """
    base_color = '#E43700'  # Rocket Red

    # Crear gradiente: versión clara → color base → versión oscura
    light_color = lighten_color(base_color, 0.8)  # 80% blanco para valores bajos
    dark_color = darken_color(base_color, 0.3)    # 30% negro para valores altos

    # El gradiente irá de claro (valores bajos) a oscuro (valores altos)
    colors = [light_color, base_color, dark_color]

    return mcolors.LinearSegmentedColormap.from_list('risk_cmap', colors)

def crear_jpeg_riesgo(riesgo_matrix, dpi=100):
    """
    Crea una imagen JPEG del mapa de riesgo y guarda información de la escala de colores.
    """
    try:
        print("Creando imagen JPEG del mapa de riesgo...")

        # Crear figura sin márgenes
        fig, ax = plt.subplots(figsize=(riesgo_matrix.shape[1]/dpi, riesgo_matrix.shape[0]/dpi), dpi=dpi)
        ax.axis('off')

        # Usar colormap personalizado
        cmap = create_risk_colormap()

        # Crear una copia de la matriz para modificar
        display_matrix = riesgo_matrix.copy().astype(float)

        # Reemplazar valores 99 con NaN para que aparezcan transparentes
        display_matrix[display_matrix == 99] = np.nan

        # Crear la imagen con el colormap (NaN aparecerá transparente)
        # Usar vmin=0, vmax=10 para que la escala cubra todo el rango posible 0-10
        im = ax.imshow(display_matrix, cmap=cmap, interpolation='nearest', aspect='equal', vmin=0, vmax=10)

        # Dibujar Neon Yellow donde había valores 0
        yellow_bg = np.zeros_like(riesgo_matrix)
        yellow_bg[riesgo_matrix == 0] = 1  # 1 para Neon Yellow, 0 para transparente
        ax.imshow(yellow_bg, cmap=mcolors.ListedColormap(['none', '#eafe07']), interpolation='nearest', aspect='equal')

        # Dibujar Electric Blue donde había valores 99
        electric_blue_bg = np.zeros_like(riesgo_matrix)
        electric_blue_bg[riesgo_matrix == 99] = 1  # 1 para Electric Blue (#0042A6), 0 para transparente
        ax.imshow(electric_blue_bg, cmap=mcolors.ListedColormap(['none', '#0042A6']), interpolation='nearest', aspect='equal')

        # Ajustar layout para eliminar márgenes
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
        plt.margins(0, 0)

        # Guardar como JPEG con calidad alta
        jpeg_path = 'riesgo.jpeg'
        plt.savefig(jpeg_path, format='jpeg', dpi=dpi, bbox_inches='tight',
                   pad_inches=0, pil_kwargs={'quality': 95, 'optimize': True})

        plt.close(fig)

        # Verificar tamaño del archivo
        file_size = os.path.getsize(jpeg_path) / 1024  # KB
        print(f"✓ Imagen JPEG guardada: {jpeg_path} ({file_size:.1f} KB)")

        # Crear información detallada de colores para cada valor
        color_map = create_risk_colormap()
        value_colors = {}

        # Generar colores para valores 0-10
        for value in range(11):  # 0, 1, 2, ..., 10
            if value == 0:
                # Valor 0: usar Neon Yellow
                hex_color = '#eafe07'
            else:
                # Valores 1-10: usar gradiente rojo
                # Para valores 1-10, normalizar al rango [0, 1]
                normalized_value = (value - 1) / 9.0  # 1->0, 10->1
                rgba = color_map(normalized_value)
                # Convertir RGBA a hex
                hex_color = '#{:02x}{:02x}{:02x}'.format(
                    int(rgba[0] * 255),
                    int(rgba[1] * 255),
                    int(rgba[2] * 255)
                )
            value_colors[str(value)] = hex_color

        # Agregar color especial para 99 (Electric Blue)
        value_colors['99'] = '#0042A6'

        # Crear información de la escala de colores
        color_scale_info = {
            'data_type': 'riesgo',
            'title': 'Mapa de Riesgo de Desastres',
            'description': 'Riesgo calculado: (flood + landslide) × 0.5 × water × (1-urban) × area_protegida',
            'color_scheme': {
                'base_color': '#E43700',
                'color_name': 'Rocket Red',
                'gradient': 'Neon Yellow (0) → Claro → Base → Oscuro (1-10, valores bajos a altos)',
                'color_mapping': value_colors,
                'special_values': {
                    '0': 'Riesgo mínimo (mostrado como Neon Yellow #eafe07)',
                    '99': 'Sin dato (mostrado como Electric Blue #0042A6)'
                },
                'value_range': {
                    'conceptual': '0-10 (escala completa del riesgo)',
                    'actual_data': {
                        'min': float(np.min(riesgo_matrix[riesgo_matrix != 99])),
                        'max': float(np.max(riesgo_matrix[riesgo_matrix != 99]))
                    }
                }
            },
            'dimensions': f"{riesgo_matrix.shape[0]}x{riesgo_matrix.shape[1]}",
            'files': {
                'jpeg': jpeg_path,
                'csv': 'riesgo.csv'
            }
        }

        # Guardar información de escala en JSON
        json_path = 'riesgo_scale.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(color_scale_info, f, indent=2, ensure_ascii=False)

        print(f"✓ Información de escala guardada: {json_path}")

        return True

    except Exception as e:
        print(f"✗ Error creando imagen JPEG: {str(e)}")
        return False

if __name__ == "__main__":
    calcular_riesgo()
