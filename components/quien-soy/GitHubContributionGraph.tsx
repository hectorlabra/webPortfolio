"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

interface GitHubContributionGraphProps {
  startDate?: Date;
  endDate?: Date;
  rows?: number;
  columns?: number;
}

export const GitHubContributionGraph: React.FC<
  GitHubContributionGraphProps
> = ({ startDate, endDate: endDateProp, rows = 7, columns = 52 }) => {
  const effectiveEndDate = useMemo(
    () => endDateProp ?? new Date(),
    [endDateProp]
  );

  // Si no se proporciona fecha de inicio, usar hace 1 año desde la fecha final
  const actualStartDate = useMemo(() => {
    const baseDate = startDate
      ? new Date(startDate)
      : new Date(effectiveEndDate);

    if (!startDate) {
      baseDate.setFullYear(effectiveEndDate.getFullYear() - 1);
      baseDate.setDate(baseDate.getDate() + 1); // +1 día para exactamente 52 semanas
    }

    return baseDate;
  }, [startDate, effectiveEndDate]);

  // Estados del componente - valores fijos para evitar animaciones
  const [contributionData, setContributionData] = useState<{
    [key: string]: number;
  }>({});

  // Usamos el hook useWindowSize para obtener el ancho actual de la ventana
  const { width: windowWidth } = useWindowSize();

  // Estado para tamaños dinámicos basados en el ancho de pantalla
  const [cellSize, setCellSize] = useState(6); // Valor inicial, se ajustará dinámicamente
  const [cellMargin, setCellMargin] = useState(2); // Valor inicial, se ajustará dinámicamente
  const weekCount = columns;

  // Referencias
  const graphRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generar datos de contribuciones estáticas para evitar animaciones
  // Utilizamos useEffect con array vacío para que solo se ejecute una vez al montar el componente
  useEffect(() => {
    // Datos estáticos para evitar cambios que causan animación
    const staticContributions: { [key: string]: number } = {};

    // Crear un conjunto fijo de datos para el gráfico
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.max(
      1,
      Math.ceil(
        (effectiveEndDate.getTime() - actualStartDate.getTime()) / msPerDay
      ) + 1
    );
    const currentDate = new Date(actualStartDate);

    // Función determinística para generar un valor basado en la fecha
    const getContributionValue = (date: Date): number => {
      // Obtener componentes de la fecha
      const day = date.getDate();
      const month = date.getMonth();
      const dayOfWeek = date.getDay();
      const weekOfYear = Math.floor(day / 7) + month * 4.3;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Semillas para variación natural
      const seedBase = day + month * 100 + date.getFullYear() * 10000;
      const seedA = ((seedBase * 9301 + 49297) % 233280) / 233280;
      const seedB = ((seedBase * 7937 + 50591) % 233280) / 233280;
      const seedC = ((seedBase * 3571 + 71933) % 233280) / 233280;
      const seedD = ((seedBase * 5167 + 61949) % 233280) / 233280; // Nueva semilla para más sutileza

      // Proyectos activos - períodos intensos pero naturales
      const projects = [
        { start: 0, end: 75, intensity: 0.92 }, // Q1
        { start: 60, end: 150, intensity: 0.88 }, // Q2
        { start: 140, end: 210, intensity: 0.9 }, // Q3
        { start: 200, end: 280, intensity: 0.91 }, // Q4 parte 1
        { start: 270, end: 365, intensity: 0.89 }, // Q4 parte 2
      ];

      // Multiplicadores por día más naturales
      const dayMultipliers = [0.4, 1.2, 1.3, 1.2, 1.4, 1.0, 0.5];

      // Base moderada-alta
      let activityBase = 0.78;

      // Verificar proyectos activos
      const dayOfYear = month * 30 + day;
      let maxProjectIntensity = 0.35;
      let activeProjects = 0;

      // Calcular intensidad de proyectos
      for (const project of projects) {
        if (dayOfYear >= project.start && dayOfYear <= project.end) {
          activeProjects++;
          const projectProgress =
            (dayOfYear - project.start) / (project.end - project.start);

          // Variación suave dentro del proyecto
          const projectWave = 0.8 + Math.sin(projectProgress * Math.PI) * 0.2;
          const currentIntensity = project.intensity * projectWave;

          maxProjectIntensity = Math.max(maxProjectIntensity, currentIntensity);
        }
      }

      // Aplicar intensidad de proyecto
      activityBase *= maxProjectIntensity;

      // Bonus muy sutil por múltiples proyectos
      if (activeProjects > 1) {
        activityBase *= 1 + Math.min(activeProjects - 1, 2) * 0.06;
      }

      // Variación diaria sutil
      const dayVariation = 0.9 + seedA * 0.2;
      activityBase *= dayMultipliers[dayOfWeek] * dayVariation;

      // Sutiles variaciones aleatorias en la actividad
      if (seedC < 0.15) {
        activityBase *= 0.7; // Reducción moderada
      } else if (seedC < 0.3) {
        activityBase *= 0.85; // Reducción sutil
      }

      // Rachas naturales
      const streakPhase =
        Math.sin(weekOfYear * 0.3 + seedA * Math.PI) * 0.5 + 0.5;
      if (streakPhase > 0.7) {
        if (seedB > 0.3) {
          activityBase *= 1.1; // Aumento sutil
        } else {
          activityBase *= 0.9; // Reducción sutil
        }
      }

      // Períodos de descanso
      if (
        (month === 11 && day >= 24 && day <= 26) ||
        (month === 7 && day >= 15 && day <= 20)
      ) {
        activityBase *= 0.2;
      }

      // Variaciones sutiles basadas en patrones naturales
      if (
        (seedBase % 17 === 0 && seedB < 0.4) ||
        (seedBase % 23 === 0 && seedA < 0.3)
      ) {
        activityBase *= 0.75; // Reducción más sutil
      }

      // Normalizar con límites realistas
      activityBase = Math.max(0.15, Math.min(activityBase, 1.0));

      // Distribuir los valores con ajustes sutiles
      let level = 0;

      if (activityBase < 0.18) {
        // Zona de baja actividad: chance de aumentar sutilmente
        level = 0;
        if (seedD < 0.2) level = 1; // 20% chance de subir un nivel
      } else if (activityBase < 0.4) {
        level = 1;
        if (seedD < 0.15) level = 2; // 15% chance de subir un nivel
      } else if (activityBase < 0.65) {
        level = 2;
      } else if (activityBase < 0.85) {
        level = 3;
        if (seedD < 0.25) level = 2; // 25% chance de bajar un nivel
      } else {
        // Zona de alta actividad: posibilidad de reducción sutil
        level = 4;
        if (seedD < 0.3) level = 3; // 30% chance de bajar un nivel
      }

      // Ajustes finales para días especiales
      if (level >= 3 && isWeekend && seedA < 0.6) {
        level--; // Reducir sutilmente actividad alta en fines de semana
      }

      // Aumentos ocasionales en días laborables
      if (level <= 1 && !isWeekend && seedD > 0.9) {
        level++; // 10% chance de aumentar días de baja actividad entre semana
      }

      return level;
    };

    // Generar datos estáticos
    for (let i = 0; i < totalDays; i++) {
      const dateKey = currentDate.toISOString().split("T")[0];
      staticContributions[dateKey] = getContributionValue(
        new Date(currentDate)
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setContributionData(staticContributions);
  }, [actualStartDate, effectiveEndDate]);

  // Manejar el renderizado inicial y los cambios de tamaño
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Nuevo useEffect para ajustar dinámicamente el tamaño de las celdas según el ancho de pantalla
  useEffect(() => {
    if (!windowWidth || !isClient) return;

    // Calculamos el tamaño óptimo de las celdas según el ancho disponible
    let newCellSize = 6;
    let newCellMargin = 2;

    if (windowWidth < 350) {
      newCellSize = 1.4;
      newCellMargin = 0.3;
    } else if (windowWidth < 375) {
      newCellSize = 1.8;
      newCellMargin = 0.4;
    } else if (windowWidth < 480) {
      newCellSize = 3;
      newCellMargin = 1;
    } else if (windowWidth < 640) {
      newCellSize = 5;
      newCellMargin = 2;
    }

    setCellSize(newCellSize);
    setCellMargin(newCellMargin);
  }, [windowWidth, isClient]);

  // Función auxiliar fija
  const getDayOfWeek = (date: Date): number => date.getDay();

  // Estado para almacenar la matriz estática y evitar recálculos
  const staticMatrix = useMemo(() => {
    if (Object.keys(contributionData).length === 0) {
      return [] as number[][];
    }

    const matrix: number[][] = Array.from({ length: rows }, () =>
      Array.from({ length: weekCount }, () => -1)
    );

    const currentDate = new Date(actualStartDate);
    const startDayOfWeek = getDayOfWeek(currentDate);

    for (let col = 0; col < weekCount; col++) {
      for (let row = 0; row < rows; row++) {
        if (col === 0 && row < startDayOfWeek) {
          matrix[row][col] = -1;
          continue;
        }

        const currentDateKey = currentDate.toISOString().split("T")[0];

        if (
          currentDate <= effectiveEndDate &&
          currentDateKey in contributionData
        ) {
          matrix[row][col] = contributionData[currentDateKey];
        } else {
          matrix[row][col] = -1;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return matrix;
  }, [actualStartDate, contributionData, effectiveEndDate, rows, weekCount]);

  // Función de tooltip eliminada

  // Componente de celda individual
  const ContributionCell: React.FC<{ intensity: number }> = ({ intensity }) => {
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
    if (!isClient) return null;

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

    // Definir tipo para las posiciones de los meses
    interface MonthPosition {
      text: string;
      position: number;
    }

    // En lugar de calcular posiciones basadas en cambios de fecha,
    // distribuimos uniformemente los meses a lo largo del año
    const monthPositions: MonthPosition[] = [];

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
        className="flex text-xs text-gray-500 mb-1 relative"
        style={{
          height: "18px",
          marginBottom: "5px",
          width: "100%",
          opacity: isClient ? 1 : 0,
        }}
      >
        {monthPositions.map((label, index) => {
          // Calculamos la posición exacta para cada mes con distribución uniforme
          const leftOffset =
            label.position * (cellSize + cellMargin * 2) +
            34 + // dayLabelOffset fijo
            (windowWidth < 350
              ? 15
              : windowWidth < 375
              ? 20
              : windowWidth < 480
              ? 30
              : 25);

          return (
            <div
              key={`month-${index}`}
              className="absolute whitespace-nowrap text-[0.7rem]"
              style={{
                left: `${leftOffset}px`,
              }}
            >
              {label.text}
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar etiquetas de días
  const renderDayLabels = () => {
    if (!isClient) return null;

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
          opacity: isClient ? 1 : 0,
        }}
      >
        {dayLabels.map((label, index) => (
          <div
            key={`day-${index}`}
            className="absolute right-0 pr-2 transform -translate-y-1/2"
            style={{
              top: positions[index],
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
                    {Array.from({ length: rows }).map((_, row) => (
                      <ContributionCell
                        key={`cell-${row}-${col}`}
                        intensity={staticMatrix[row]?.[col] || 0}
                      />
                    ))}
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
