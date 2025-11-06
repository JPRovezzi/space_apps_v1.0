import pandas as pd
import os
import json

def get_csv_dimensions(directory):
    """
    Obtiene las dimensiones (filas, columnas) de todos los archivos CSV en un directorio.
    """
    csv_files = [f for f in os.listdir(directory) if f.endswith('.csv')]

    if not csv_files:
        print("No se encontraron archivos CSV en el directorio.")
        return

    dimensions = {}

    for csv_file in csv_files:
        file_path = os.path.join(directory, csv_file)
        try:
            # Leer el CSV con pandas
            df = pd.read_csv(file_path)

            # Obtener dimensiones
            rows, cols = df.shape

            # Formato: filasxcolumnas (ej: 1286x978)
            dimensions[csv_file] = f"{rows}x{cols}"

            print(f"{csv_file}: {rows}x{cols}")

        except Exception as e:
            print(f"Error al procesar {csv_file}: {str(e)}")
            dimensions[csv_file] = f"Error: {str(e)}"

    # Guardar en archivo JSON
    json_filename = "csv_dimensions.json"
    with open(json_filename, 'w', encoding='utf-8') as f:
        json.dump(dimensions, f, indent=2, ensure_ascii=False)

    print(f"\nDimensiones guardadas en {json_filename}")

if __name__ == "__main__":
    # Usar el directorio actual
    current_directory = "."
    get_csv_dimensions(current_directory)
