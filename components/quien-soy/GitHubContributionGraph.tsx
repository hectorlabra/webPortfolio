"use client";

import { useState, useEffect, useRef } from "react";

interface ContributionCellProps {
  intensity: number;
  date: Date;
}

interface GitHubContributionGraphProps {
  startDate?: Date;
  endDate?: Date;
  rows?: number;
  text?: string;
  columns?: number;
}

interface TooltipProps {
  content: string;
  visible: boolean;
  x: number;
  y: number;
}

export const GitHubContributionGraph: React.FC<
  GitHubContributionGraphProps
> = ({ startDate, endDate = new Date(), rows = 7, text, columns = 52 }) => {
  // Si no se proporciona fecha de inicio, usar hace 1 año desde la fecha final
  const actualStartDate = startDate || new Date(endDate);
  if (!startDate) {
    actualStartDate.setFullYear(endDate.getFullYear() - 1);
    actualStartDate.setDate(actualStartDate.getDate() + 1); // +1 día para exactamente 52 semanas
  }

  // Estados del componente - valores fijos para evitar animaciones
  const [contributionData, setContributionData] = useState<{
    [key: string]: number;
  }>({});
  // Valores ligeramente reducidos para dar más "aire" al componente
  const cellSize = 7; // Reducido de 8px a 7px
  const cellMargin = 2.5; // Aumentado de 2px a 2.5px
  const [weekCount, setWeekCount] = useState(columns);

  // Referencias
  const graphRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Eliminado el useEffect de resize ya que usamos valores constantes

  // Generar datos de contribuciones estáticas para evitar animaciones
  // Utilizamos useEffect con array vacío para que solo se ejecute una vez al montar el componente
  useEffect(() => {
    // Datos estáticos para evitar cambios que causan animación
    const staticContributions: { [key: string]: number } = {};

    // Crear un conjunto fijo de datos para el gráfico
    const dayCount = 365; // Un año completo
    let currentDate = new Date(actualStartDate);

    // Patrón fijo para evitar aleatorios que causan animación
    const intensityPattern = [
      0, 1, 2, 3, 4, 0, 0, 1, 0, 1, 2, 0, 0, 0, 2, 1, 3, 0, 0, 1, 0, 0, 2, 1, 0,
      3, 4, 0, 1, 0, 0, 2, 0, 1, 0, 0, 3, 0, 1, 0, 0, 2, 3, 2, 1, 4, 0, 0, 0,
    ];

    // Generar datos estáticos
    for (let i = 0; i < dayCount; i++) {
      const dateKey = currentDate.toISOString().split("T")[0];
      // Usar un patrón fijo en lugar de valores aleatorios
      staticContributions[dateKey] =
        intensityPattern[i % intensityPattern.length];
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Establecer valor fijo para weekCount para evitar recálculos
    setWeekCount(52); // Valor fijo exacto
    setContributionData(staticContributions);
  }, []); // Array vacío para ejecutar solo una vez

  // Función auxiliar fija
  const getDayOfWeek = (date: Date): number => date.getDay();

  // Estado para almacenar la matriz estática y evitar recálculos
  const [staticMatrix, setStaticMatrix] = useState<number[][]>([]);

  // Generar matriz una sola vez y guardarla
  useEffect(() => {
    if (Object.keys(contributionData).length > 0 && staticMatrix.length === 0) {
      const matrix: number[][] = Array(rows)
        .fill(0)
        .map(() => Array(weekCount).fill(-1));

      let currentDate = new Date(actualStartDate);
      const startDayOfWeek = getDayOfWeek(currentDate);

      // Llenar la matriz con los datos estáticos
      for (let col = 0; col < weekCount; col++) {
        for (let row = 0; row < rows; row++) {
          if (col === 0 && row < startDayOfWeek) {
            matrix[row][col] = -1; // Celda fuera del rango
            continue;
          }

          const currentDateKey = currentDate.toISOString().split("T")[0];

          if (currentDate <= endDate && currentDateKey in contributionData) {
            matrix[row][col] = contributionData[currentDateKey];
          } else {
            matrix[row][col] = -1; // Fuera del rango
          }

          // Avanzar al siguiente día
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      setStaticMatrix(matrix);
    }
  }, [contributionData]);

  // Función de tooltip eliminada

  // Componente de celda individual
  const ContributionCell: React.FC<ContributionCellProps> = ({
    intensity,
    date,
  }) => {
    // Paleta de colores de GitHub en modo oscuro
    const colors = [
      "#161b22", // Sin contribuciones
      "#0e4429", // Nivel 1
      "#006d32", // Nivel 2
      "#26a641", // Nivel 3
      "#39d353", // Nivel 4
    ];

    // Eliminados controladores de eventos para quitar animaciones del tooltip

    // Si intensity es -1, esta celda está fuera del rango de fechas
    if (intensity === -1) {
      return (
        <div
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            margin: `${cellMargin}px`,
            visibility: "hidden",
          }}
        />
      );
    }

    return (
      <div
        style={{
          backgroundColor: colors[intensity],
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          borderRadius: `${Math.max(1, cellSize / 6)}px`,
          margin: `${cellMargin}px`,
          transition: "none", // Deshabilitar cualquier transición CSS
        }}
        aria-label={`Contribución nivel ${intensity}`}
        role="gridcell"
      />
    );
  };

  // Renderizar etiquetas de meses
  const renderMonthLabels = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const labels = [];
    let currentDate = new Date(actualStartDate);
    let currentMonth = currentDate.getMonth();

    for (let week = 0; week < weekCount; week++) {
      if (currentDate.getMonth() !== currentMonth || week === 0) {
        currentMonth = currentDate.getMonth();

        labels.push({
          text: months[currentMonth],
          position: week,
        });
      }

      // Avanzar 7 días
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return (
      <div
        className="flex text-xs text-gray-500 mb-1 position-relative pl-8"
        style={{ height: "20px", marginBottom: "6px" }} // Más espacio vertical
      >
        {labels.map((label, index) => (
          <div
            key={`month-${index}`}
            style={{
              position: "absolute",
              left: `${
                label.position * (cellSize + cellMargin * 2) +
                40 + // Aumentado de 30 a 40 para más espacio horizontal
                (label.text.length > 2 ? -4 : 0) // Ajuste mejorado según longitud
              }px`,
              whiteSpace: "nowrap", // Evita que los meses se corten
            }}
          >
            {label.text}
          </div>
        ))}
      </div>
    );
  };

  // Renderizar etiquetas de días de semana
  const renderDayLabels = () => {
    // Solo mostrar lunes, miércoles y viernes
    const dayLabels = ["Mon", "Wed", "Fri"];

    // Calcular posiciones basadas en la disposición real de los cuadros
    const cellTotalSize = cellSize + cellMargin * 2;
    const row1Position = cellTotalSize * 1; // Primera fila con etiqueta (lunes)
    const row3Position = cellTotalSize * 3; // Segunda fila con etiqueta (miércoles)
    const row5Position = cellTotalSize * 5; // Tercera fila con etiqueta (viernes)

    return (
      <div
        className="flex flex-col mr-2 text-xs text-gray-500"
        style={{
          height: rows * cellTotalSize,
          position: "relative",
          width: "32px", // Aumentado de 25px a 32px para más espacio
          marginRight: "8px", // Aumentado de 4px a 8px para más separación
        }}
      >
        {/* Lunes - posición exacta */}
        <div
          style={{
            position: "absolute",
            top: row1Position,
            right: 0,
            paddingRight: "2px", // Añadido padding para aire adicional
          }}
        >
          {dayLabels[0]}
        </div>

        {/* Miércoles - posición exacta */}
        <div
          style={{
            position: "absolute",
            top: row3Position,
            right: 0,
            paddingRight: "2px", // Añadido padding para aire adicional
          }}
        >
          {dayLabels[1]}
        </div>

        {/* Viernes - posición exacta */}
        <div
          style={{
            position: "absolute",
            top: row5Position,
            right: 0,
            paddingRight: "2px", // Añadido padding para aire adicional
          }}
        >
          {dayLabels[2]}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center my-4 w-full"
      ref={containerRef}
    >
      <div
        className="p-4 sm:p-6 rounded-lg bg-[#0d1116] border border-gray-800 relative w-full"
        ref={graphRef}
      >
        {/* Etiquetas de meses */}
        {renderMonthLabels()}

        <div className="flex items-center justify-center">
          {/* Etiquetas de días */}
          {renderDayLabels()}

          {/* Matriz de contribuciones */}
          <div
            className="flex flex-nowrap overflow-visible"
            role="grid"
            aria-label="GitHub Contribution Graph"
          >
            {staticMatrix.length > 0 ? (
              <div className="flex">
                {Array.from({ length: weekCount }).map((_, col) => (
                  <div key={`col-${col}`} className="flex flex-col">
                    {Array.from({ length: rows }).map((_, row) => {
                      // Usar fecha fija para evitar recálculos
                      const cellDate = new Date(actualStartDate);

                      return (
                        <ContributionCell
                          key={`cell-${row}-${col}`}
                          intensity={staticMatrix[row]?.[col] || 0}
                          date={cellDate}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center">
                <p className="text-gray-400 text-sm">Cargando...</p>
              </div>
            )}
          </div>
        </div>

        {/* Leyenda */}
        {/* Aumentado mt-2 a mt-4 */}
        <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
          {/* Aumentado mr-1 a mr-2 */}
          <span className="mr-2">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={`legend-${level}`}
              className="inline-block mx-1" /* Aumentado mx-[2px] a mx-1 */
              style={{
                backgroundColor:
                  level === 0
                    ? "#161b22"
                    : level === 1
                    ? "#0e4429"
                    : level === 2
                    ? "#006d32"
                    : level === 3
                    ? "#26a641"
                    : "#39d353",
                width: "10px",
                height: "10px",
                borderRadius: "2px",
              }}
            />
          ))}
          {/* Aumentado ml-1 a ml-2 */}
          <span className="ml-2">More</span>
        </div>

        {/* Tooltip eliminado para quitar animaciones */}
      </div>
    </div>
  );
};

export default GitHubContributionGraph;
