"use client";

import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

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

  // Usamos el hook useWindowSize para obtener el ancho actual de la ventana
  const { width: windowWidth } = useWindowSize();

  // Estado para tamaños dinámicos basados en el ancho de pantalla
  const [cellSize, setCellSize] = useState(6); // Valor inicial, se ajustará dinámicamente
  const [cellMargin, setCellMargin] = useState(2); // Valor inicial, se ajustará dinámicamente
  const [weekCount, setWeekCount] = useState(columns);

  // Referencias
  const graphRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Nuevo useEffect para ajustar dinámicamente el tamaño de las celdas según el ancho de pantalla
  useEffect(() => {
    if (!windowWidth) return;

    // Calculamos el tamaño óptimo de las celdas según el ancho disponible
    // Consideramos que necesitamos espacio para 52 columnas (semanas) + etiquetas de días (espacio variable)
    const containerWidth = windowWidth > 650 ? 650 : windowWidth - 30; // máx 650px o ancho disponible con padding
    // Ajustar espacio para etiquetas de días según tamaño de pantalla
    const dayLabelSpace = windowWidth < 375 ? 22 : windowWidth < 480 ? 28 : 34; // Reducción para pantallas pequeñas
    const availableWidth = containerWidth - dayLabelSpace;

    // Calcular tamaño de celda basado en el espacio disponible
    let newCellSize = 6; // valor por defecto
    let newCellMargin = 2;

    if (windowWidth < 350) {
      // Ultra pequeño - móviles extremadamente pequeños
      newCellSize = 1.4;
      newCellMargin = 0.3;
    } else if (windowWidth < 375) {
      // Extra pequeño - móviles muy pequeños
      newCellSize = 1.8;
      newCellMargin = 0.4;
    } else if (windowWidth < 480) {
      // Pequeño - móviles
      newCellSize = 3;
      newCellMargin = 1;
    } else if (windowWidth < 640) {
      // Mediano - tablets pequeñas
      newCellSize = 5;
      newCellMargin = 2;
    } else {
      // Grande - tablets y desktop
      newCellSize = 6;
      newCellMargin = 2;
    }

    setCellSize(newCellSize);
    setCellMargin(newCellMargin);
  }, [windowWidth]); // Se ejecuta cada vez que cambia el ancho de ventana

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

    // En lugar de calcular posiciones basadas en cambios de fecha,
    // distribuimos uniformemente los meses a lo largo del año
    const monthPositions = [];

    // Determinar cuántos meses mostrar según el ancho de pantalla
    const visibleMonths = [];

    if (windowWidth < 350) {
      // Dispositivos ultra pequeños: mostrar solo 2 meses (semestre)
      visibleMonths.push(0, 6); // Ene, Jul
    } else if (windowWidth < 375) {
      // Dispositivos muy pequeños: mostrar solo 3 meses (trimestre)
      visibleMonths.push(0, 4, 8); // Ene, May, Sep
    } else if (windowWidth < 480) {
      // Dispositivos pequeños: mostrar 4 meses (trimestres)
      visibleMonths.push(0, 3, 6, 9); // Ene, Abr, Jul, Oct
    } else if (windowWidth < 640) {
      // Dispositivos medianos: mostrar 6 meses (bimensual)
      visibleMonths.push(0, 2, 4, 6, 8, 10); // Ene, Mar, May, Jul, Sep, Nov
    } else {
      // Dispositivos grandes: mostrar todos los meses
      for (let i = 0; i < 12; i++) {
        visibleMonths.push(i);
      }
    }

    // Calculamos el ancho total disponible para las columnas
    const totalWidth = weekCount * (cellSize + cellMargin * 2);
    // Offset para las etiquetas de los días de la semana
    const dayLabelOffset = 34;

    // Distribuir los meses seleccionados uniformemente a lo largo del año
    visibleMonths.forEach((i) => {
      // Calculamos la posición de cada mes de manera uniforme
      // Para 12 meses en 52 semanas, cada mes ocupa aproximadamente 4.33 semanas
      const position = Math.floor(i * (weekCount / 12));

      monthPositions.push({
        text: months[i],
        position: position,
      });
    });

    return (
      <div
        className="flex text-xs text-gray-500 mb-1 position-relative"
        style={{
          height: "18px",
          marginBottom: "5px",
          width: "100%",
        }}
      >
        {monthPositions.map((label, index) => {
          // Calculamos la posición exacta para cada mes con distribución uniforme
          const leftOffset =
            label.position * (cellSize + cellMargin * 2) +
            dayLabelOffset +
            // Ajuste adicional según el tamaño de pantalla
            (windowWidth < 350
              ? 15
              : windowWidth < 375
              ? 20
              : windowWidth < 480
              ? 30
              : 50);

          return (
            <div
              key={`month-${index}`}
              style={{
                position: "absolute",
                left: `${leftOffset}px`,
                whiteSpace: "nowrap",
                fontSize: "0.7rem",
              }}
            >
              {label.text}
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar etiquetas de días de semana
  const renderDayLabels = () => {
    // Determinar qué etiquetas de días mostrar según el tamaño de pantalla
    let dayLabels = [];

    if (windowWidth < 375) {
      // En pantallas muy pequeñas, mostrar solo "M"
      dayLabels = ["M"];
    } else if (windowWidth < 480) {
      // En pantallas pequeñas, mostrar solo "Mon"
      dayLabels = ["Mon"];
    } else if (windowWidth < 640) {
      // En pantallas medianas, mostrar lunes y viernes
      dayLabels = ["Mon", "Fri"];
    } else {
      // En pantallas grandes, mostrar lunes, miércoles y viernes
      dayLabels = ["Mon", "Wed", "Fri"];
    }

    // Calcular posiciones basadas en la disposición real de los cuadros
    const cellTotalSize = cellSize + cellMargin * 2;

    // Distribuir los días según cuántos vamos a mostrar
    const totalHeight = rows * cellTotalSize;
    let positions = [];

    if (dayLabels.length === 1) {
      // Si solo mostramos un día, lo ponemos en el centro
      positions = [Math.floor(totalHeight * 0.5)];
    } else if (dayLabels.length === 2) {
      // Si mostramos dos días, los distribuimos
      positions = [
        Math.floor(totalHeight * 0.25),
        Math.floor(totalHeight * 0.75),
      ];
    } else {
      // Si mostramos tres días, los distribuimos
      positions = [
        Math.floor(totalHeight * 0.15),
        Math.floor(totalHeight * 0.5),
        Math.floor(totalHeight * 0.85),
      ];
    }

    // Calcular el ancho adecuado según el tamaño de pantalla
    const labelWidth = windowWidth < 480 ? "20px" : "28px";

    return (
      <div
        className="flex flex-col mr-2 text-xs text-gray-500"
        style={{
          height: totalHeight,
          position: "relative",
          width: labelWidth,
          marginRight: windowWidth < 480 ? "4px" : "6px",
          fontSize: windowWidth < 480 ? "0.65rem" : "0.7rem",
        }}
      >
        {dayLabels.map((label, index) => (
          <div
            key={`day-${index}`}
            style={{
              position: "absolute",
              top: positions[index],
              right: 0,
              paddingRight: "2px",
              transform: "translateY(-50%)", // Centrar verticalmente
            }}
          >
            {label}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center my-2 w-full"
      ref={containerRef}
    >
      <div
        className="p-2 sm:p-3 md:p-4 rounded-lg bg-[#0d1116] border border-gray-800 relative w-full"
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
        <div className="flex justify-end items-center mt-3 text-xs text-gray-500">
          <span className="mr-1.5 text-[0.7rem]">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={`legend-${level}`}
              className="inline-block mx-0.5"
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
                width: "9px",
                height: "9px",
                borderRadius: "1.5px",
              }}
            />
          ))}
          <span className="ml-1.5 text-[0.7rem]">More</span>
        </div>

        {/* Tooltip eliminado para quitar animaciones */}
      </div>
    </div>
  );
};

export default GitHubContributionGraph;
