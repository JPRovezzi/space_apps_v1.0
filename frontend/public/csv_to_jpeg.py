"""
Script para convertir archivos CSV geoespaciales en imágenes JPEG
con escalas de colores específicas para cada tipo de dato.

Uso: python csv_to_jpeg.py
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import os
import json
from pathlib import Path

def load_csv_data(csv_path):
    """
    Carga datos CSV y los convierte en una matriz numpy.
    Maneja el formato especial donde la primera columna son etiquetas Y_0, Y_1, etc.
    """
    try:
        # Leer el CSV
        df = pd.read_csv(csv_path)

        # Convertir a numpy array, omitiendo la primera columna (etiquetas Y_0, Y_1, etc.)
        if df.shape[1] > 1:
            # Tomar todas las columnas excepto la primera
            matrix = df.iloc[:, 1:].values
        else:
            # Si solo hay una columna, usar toda la matriz
            matrix = df.values

        print(f"✓ {os.path.basename(csv_path)}: {matrix.shape[0]}x{matrix.shape[1]}")
        return matrix.astype(float)

    except Exception as e:
        print(f"✗ Error cargando {csv_path}: {str(e)}")
        return None

def get_color_scheme(data_type):
    """
    Define esquemas de colores apropiados para cada tipo de dato geoespacial.
    Ahora usa gradientes de claro a oscuro con el color base específico.
    """
    schemes = {
        'expansion': {
            'cmap': 'custom',
            'title': 'Expansión Urbana',
            'description': 'Gradiente Electric Blue: claro → base → oscuro'
        },
        'flood': {
            'cmap': 'custom',
            'title': 'Inundaciones',
            'description': 'Gradiente Rocket Red: claro → base → oscuro'
        },
        'landslide': {
            'cmap': 'custom',
            'title': 'Deslizamientos',
            'description': 'Gradiente Orange: claro → base → oscuro'
        },
        'urban': {
            'cmap': 'custom',
            'title': 'Área Urbana',
            'description': 'Gradiente Gris: claro → base → oscuro'
        },
        'water': {
            'cmap': 'custom',
            'title': 'Cuerpos de Agua',
            'description': 'Gradiente Electric Blue: claro → base → oscuro'
        }
    }

    return schemes.get(data_type, {
        'cmap': 'viridis',
        'title': f'Datos {data_type}',
        'description': 'Escala de colores por defecto'
    })

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

def create_custom_colormap(data_type):
    """
    Crea gradientes de claro a oscuro usando solo el color base de cada tipo de dato.
    """
    # Colores base para cada tipo de dato
    base_colors = {
        'expansion': '#0042A6',   # Electric Blue
        'flood': '#E43700',       # Rocket Red
        'landslide': '#FF6B35',   # Orange
        'urban': '#666666',       # Gris medio
        'water': '#0042A6'        # Electric Blue (mismo que expansion)
    }

    base_color = base_colors.get(data_type, '#0042A6')

    if data_type in base_colors:
        # Crear gradiente: versión clara → color base → versión oscura
        light_color = lighten_color(base_color, 0.7)  # 70% blanco
        dark_color = darken_color(base_color, 0.6)    # 60% negro

        colors = [light_color, base_color, dark_color]
        return mcolors.LinearSegmentedColormap.from_list(f'{data_type}_cmap', colors)

    else:
        # Colormap por defecto para tipos no reconocidos
        return plt.cm.viridis

def save_as_jpeg(matrix, output_path, data_type, dpi=100):
    """
    Convierte una matriz en una imagen JPEG y la guarda.
    """
    try:
        # Crear figura sin márgenes
        fig, ax = plt.subplots(figsize=(matrix.shape[1]/dpi, matrix.shape[0]/dpi), dpi=dpi)
        ax.axis('off')

        # Usar colormap personalizado
        cmap = create_custom_colormap(data_type)

        # Crear la imagen con el colormap
        im = ax.imshow(matrix, cmap=cmap, interpolation='nearest', aspect='equal')

        # Ajustar layout para eliminar márgenes
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
        plt.margins(0, 0)

        # Guardar como JPEG con calidad alta
        plt.savefig(output_path, format='jpeg', dpi=dpi, bbox_inches='tight',
                   pad_inches=0, pil_kwargs={'quality': 95, 'optimize': True})

        plt.close(fig)

        # Verificar tamaño del archivo
        file_size = os.path.getsize(output_path) / 1024  # KB
        print(f"✓ Guardado: {os.path.basename(output_path)} ({file_size:.1f} KB)")

        return True

    except Exception as e:
        print(f"✗ Error guardando {output_path}: {str(e)}")
        return False

def process_csv_files(directory=".", output_dir="."):
    """
    Procesa todos los archivos CSV en el directorio y los convierte a JPEG.
    """
    # Crear directorio de salida
    Path(output_dir).mkdir(exist_ok=True)

    print(f"📂 Buscando CSVs en: {os.path.abspath(directory)}")

    # Buscar archivos CSV
    csv_files = [f for f in os.listdir(directory) if f.endswith('.csv')]
    csv_files.sort()  # Ordenar alfabéticamente

    if not csv_files:
        print(f"✗ No se encontraron archivos CSV en: {os.path.abspath(directory)}")
        return

    print(f"🔍 Encontrados {len(csv_files)} archivos CSV:")
    print("=" * 50)

    processed = 0
    results = {}

    for csv_file in csv_files:
        csv_path = os.path.join(directory, csv_file)

        # Determinar tipo de dato del nombre del archivo
        data_type = csv_file.replace('.csv', '').lower()

        print(f"\n📊 Procesando: {csv_file}")
        print(f"🎨 Tipo de dato: {data_type}")

        # Cargar datos
        matrix = load_csv_data(csv_path)
        if matrix is None:
            continue

        # Crear nombre de archivo JPEG
        jpeg_filename = f"{data_type}.jpeg"
        jpeg_path = os.path.join(output_dir, jpeg_filename)

        # Obtener esquema de colores
        color_scheme = get_color_scheme(data_type)
        print(f"🎨 Colormap: {color_scheme['description']}")

        # Convertir y guardar como JPEG
        if save_as_jpeg(matrix, jpeg_path, data_type):
            results[csv_file] = {
                'jpeg_path': jpeg_path,
                'dimensions': f"{matrix.shape[0]}x{matrix.shape[1]}",
                'data_type': data_type,
                'color_scheme': color_scheme['title']
            }
            processed += 1

    print("\n" + "=" * 50)
    print(f"✅ Procesamiento completado: {processed}/{len(csv_files)} archivos convertidos")

    # Guardar resumen en JSON
    summary_path = os.path.join(output_dir, 'conversion_summary.json')
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"📋 Resumen guardado en: {os.path.basename(summary_path)}")

    return results

def main():
    """
    Función principal del script.
    """
    print("🚀 Conversor CSV → JPEG para datos geoespaciales")
    print("NASA Space Apps Challenge Córdoba")
    print("=" * 50)

    # Intentar procesar archivos CSV en el directorio actual
    results = process_csv_files(".", ".")

    # Si no se encontraron CSVs, intentar en el directorio del script
    if not results:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        print(f"\n🔄 Reintentando en el directorio del script: {script_dir}")
        results = process_csv_files(script_dir, script_dir)

    if results:
        print("\n📁 Archivos JPEG generados:")
        for csv_file, info in results.items():
            print(f"  • {csv_file} → {os.path.basename(info['jpeg_path'])}")
            print(f"    Dimensiones: {info['dimensions']}")
            print(f"    Tema: {info['color_scheme']}")

        print("\n💡 Los archivos JPEG están listos para ser usados en la aplicación web!")
        print("   Se guardaron directamente en frontend/public/")
        return 0
    else:
        print("\n❌ No se pudieron procesar los archivos CSV.")
        print("💡 El script buscará automáticamente en el directorio donde está ubicado.")
        print("   Asegúrate de que los CSVs estén en frontend/public/")
        return 1

if __name__ == "__main__":
    exit(main())
