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

  // Estados del componente
  const [contributionData, setContributionData] = useState<{
    [key: string]: number;
  }>({});
  const [cellSize, setCellSize] = useState(11);
  const [cellMargin, setCellMargin] = useState(2);
  const [tooltip, setTooltip] = useState<TooltipProps>({
    content: "",
    visible: false,
    x: 0,
    y: 0,
  });
  const [weekCount, setWeekCount] = useState(columns);

  // Referencias
  const graphRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ajustar tamaño de celda según el ancho disponible
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const availableWidth = containerRef.current.clientWidth;
      const labelsWidth = 30; // Etiquetas de días
      const sideMargins = 16;

      const availableWidthForCells = availableWidth - labelsWidth - sideMargins;
      const weeklySpace = availableWidthForCells / weekCount;
      const calculatedCellSize = Math.floor((weeklySpace - 4) / 1.1);

      const finalCellSize = Math.min(Math.max(calculatedCellSize, 6), 12);
      setCellSize(finalCellSize);
      setCellMargin(finalCellSize > 8 ? 2 : 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [weekCount]);

  // Generar datos de contribuciones basados en texto si se proporciona
  useEffect(() => {
    const generateContributions = () => {
      const contributions: { [key: string]: number } = {};
      let pattern: number[][] = [];

      // Si hay texto, generar un patrón basado en él
      if (text && text.length > 0) {
        // Mapear el texto a un patrón de intensidades
        // Este es un algoritmo simplificado para generar un patrón basado en caracteres
        const charToIntensity = (char: string): number => {
          const asciiCode = char.charCodeAt(0);
          if (asciiCode < 65) return 0;
          if (asciiCode < 90)
            return Math.min(4, Math.floor((asciiCode - 65) / 6) + 1);
          if (asciiCode < 97) return 0;
          return Math.min(4, Math.floor((asciiCode - 97) / 6) + 1);
        };

        // Generar una matriz de patrón basada en el texto
        const textIntensities = text.split("").map(charToIntensity);
        pattern = Array(rows)
          .fill(0)
          .map((_, rowIndex) => {
            return Array(weekCount)
              .fill(0)
              .map((_, colIndex) => {
                const index = rowIndex * weekCount + colIndex;
                if (index < textIntensities.length) {
                  return textIntensities[index];
                }
                return 0;
              });
          });
      } else {
        // Patrones de actividad aleatoria
        const highActivityPeriods = [
          {
            start: new Date(
              actualStartDate.getTime() + 30 * 24 * 60 * 60 * 1000
            ),
            end: new Date(actualStartDate.getTime() + 50 * 24 * 60 * 60 * 1000),
            probability: 0.8,
            maxIntensity: 4,
          },
          {
            start: new Date(
              actualStartDate.getTime() + 150 * 24 * 60 * 60 * 1000
            ),
            end: new Date(
              actualStartDate.getTime() + 185 * 24 * 60 * 60 * 1000
            ),
            probability: 0.85,
            maxIntensity: 4,
          },
          {
            start: new Date(
              actualStartDate.getTime() + 250 * 24 * 60 * 60 * 1000
            ),
            end: new Date(
              actualStartDate.getTime() + 280 * 24 * 60 * 60 * 1000
            ),
            probability: 0.9,
            maxIntensity: 4,
          },
        ];

        // Probabilidad por día de semana (más actividad de lunes a viernes)
        const weekdayProbability = [0.3, 0.75, 0.85, 0.9, 0.85, 0.7, 0.2];

        // Generar datos para cada día
        let currentDate = new Date(actualStartDate);
        const dayCount =
          Math.floor(
            (endDate.getTime() - actualStartDate.getTime()) /
              (24 * 60 * 60 * 1000)
          ) + 1;

        setWeekCount(Math.ceil(dayCount / 7) + 1);

        for (let i = 0; i < dayCount; i++) {
          const dateKey = currentDate.toISOString().split("T")[0];
          const dayOfWeek = currentDate.getDay();

          let probability = weekdayProbability[dayOfWeek];
          let maxIntensity = 3;

          // Comprobar si está en periodo de alta actividad
          highActivityPeriods.forEach((period) => {
            if (currentDate >= period.start && currentDate <= period.end) {
              probability = period.probability;
              maxIntensity = period.maxIntensity;
            }
          });

          // Generar intensidad basada en probabilidad
          const random = Math.random();
          let intensity = 0;

          if (random < probability) {
            const r = Math.random();

            if (r < 0.7) intensity = 1;
            else if (r < 0.85) intensity = 2;
            else if (r < 0.95) intensity = 3;
            else intensity = maxIntensity;
          }

          contributions[dateKey] = intensity;

          // Avanzar al siguiente día
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      return contributions;
    };

    setContributionData(generateContributions());
  }, [actualStartDate, endDate, text, columns, rows]);

  // Funciones auxiliares
  const getDayOfWeek = (date: Date): number => date.getDay();

  // Generar matriz para renderizar el gráfico
  const getContributionMatrix = () => {
    const matrix: number[][] = Array(rows)
      .fill(0)
      .map(() => Array(weekCount).fill(-1));

    let currentDate = new Date(actualStartDate);
    const startDayOfWeek = getDayOfWeek(currentDate);

    // Llenar la matriz con los datos de contribución
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

    return matrix;
  };

  // Generar mensaje para el tooltip
  const getTooltipMessage = (intensity: number, date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const commitMessages = [
      "feat: Updated site UI",
      "fix: Corrected responsive layout",
      "chore: Code cleanup",
      "docs: Updated documentation",
      "style: Improved dark mode",
      "refactor: Optimized performance",
      "test: Added unit tests",
    ];

    // Número de commits según intensidad
    const commitsNumber =
      intensity === 0 ? 0 : intensity * 2 - 1 + Math.floor(Math.random() * 3);

    if (intensity === 0) {
      return `No contributions on ${month} ${day}, ${year}`;
    }

    // Mensaje aleatorio para el tooltip
    const randomMessage =
      commitMessages[Math.floor(Math.random() * commitMessages.length)];

    return `${commitsNumber} contributions on ${month} ${day}, ${year}\n${randomMessage}`;
  };

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

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      // Calcular posición para el tooltip
      const rect = e.currentTarget.getBoundingClientRect();
      const graphRect = graphRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

      setTooltip({
        content: getTooltipMessage(intensity, date),
        visible: true,
        x: rect.left - graphRect.left + cellSize / 2,
        y: rect.top - graphRect.top - 10,
      });
    };

    const handleMouseLeave = () => {
      setTooltip({ ...tooltip, visible: false });
    };

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
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        className="flex text-xs text-gray-500 mb-1 position-relative"
        style={{ height: "20px" }}
      >
        {labels.map((label, index) => (
          <div
            key={`month-${index}`}
            style={{
              position: "absolute",
              left: `${
                label.position * (cellSize + cellMargin * 2) +
                (cellSize + cellMargin * 2) * 0.8
              }px`,
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
    const days = ["", "Mon", "", "Wed", "", "Fri", ""];

    return (
      <div className="flex flex-col mr-2 text-xs text-gray-500 justify-around h-full">
        {days.map((day, index) => (
          <div
            key={index}
            style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Obtener la matriz de contribuciones
  const matrix = getContributionMatrix();

  return (
    <div
      className="flex flex-col items-center justify-center my-4 w-full"
      ref={containerRef}
    >
      <div
        className="p-2 sm:p-3 rounded-lg bg-[#0d1116] border border-gray-800 relative w-full"
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
            {matrix.length > 0 ? (
              <div className="flex">
                {Array.from({ length: weekCount }).map((_, col) => (
                  <div key={`col-${col}`} className="flex flex-col">
                    {Array.from({ length: rows }).map((_, row) => {
                      // Calcular fecha para esta celda
                      const cellDate = new Date(actualStartDate);
                      cellDate.setDate(
                        cellDate.getDate() +
                          col * 7 +
                          row -
                          getDayOfWeek(actualStartDate)
                      );

                      return (
                        <ContributionCell
                          key={`cell-${row}-${col}`}
                          intensity={matrix[row][col]}
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
        <div className="flex justify-end items-center mt-2 text-xs text-gray-500">
          <span className="mr-1">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={`legend-${level}`}
              className="inline-block mx-[2px]"
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
          <span className="ml-1">More</span>
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-pre border border-gray-700"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: "translate(-50%, -100%)",
              filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))",
              pointerEvents: "none",
            }}
          >
            {tooltip.content}
            <div
              className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-800 border-r border-b border-gray-700"
              style={{ transform: "translateX(-50%) rotate(45deg)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubContributionGraph;
