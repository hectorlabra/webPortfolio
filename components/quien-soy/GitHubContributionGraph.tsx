"use client";

import { useState, useEffect, useRef } from 'react';

interface ContributionCellProps {
  intensity: number;
  date: Date;
}

interface GitHubContributionGraphProps {
  startDate?: Date;
  endDate?: Date;
  rows?: number;
}

interface TooltipProps {
  content: string;
  visible: boolean;
  x: number;
  y: number;
}

export const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({
  startDate,
  endDate = new Date(),
  rows = 7
}) => {
  // Si no se proporciona fecha de inicio, usar hace 1 año desde la fecha final
  const actualStartDate = startDate || new Date(endDate);
  if (!startDate) {
    actualStartDate.setFullYear(endDate.getFullYear() - 1);
    actualStartDate.setDate(actualStartDate.getDate() + 1); // Añadir un día para que sean exactamente 52 semanas
  }
  
  // Estado para la matriz de contribuciones y UI
  const [contributionData, setContributionData] = useState<{[key: string]: number}>({});
  const [cellSize, setCellSize] = useState(11);
  const [cellMargin, setCellMargin] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipProps>({
    content: '',
    visible: false,
    x: 0,
    y: 0
  });
  const [weekCount, setWeekCount] = useState(53); // ~1 año (52 semanas + 1 por posibles días parciales)
  
  const graphRef = useRef<HTMLDivElement>(null);
  
  // Determinar el tamaño de celdas según ancho de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setCellSize(6);
        setCellMargin(1);
      } else if (window.innerWidth < 640) {
        setCellSize(8);
        setCellMargin(1);
      } else if (window.innerWidth < 768) {
        setCellSize(10);
        setCellMargin(2);
      } else {
        setCellSize(11);
        setCellMargin(2);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generar datos de contribuciones simulados
  useEffect(() => {
    const generateContributions = () => {
      const contributions: {[key: string]: number} = {};
      
      // Definir patrones para simular actividad real de GitHub
      // Los desarrolladores suelen tener días con muchas contribuciones y días sin actividad
      
      // Fechas para periodos de alta actividad (simulando sprints o proyectos intensos)
      const highActivityPeriods = [
        {
          start: new Date(actualStartDate.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 días desde inicio
          end: new Date(actualStartDate.getTime() + 50 * 24 * 60 * 60 * 1000),   // +50 días desde inicio
          probability: 0.8,
          maxIntensity: 4
        },
        {
          start: new Date(actualStartDate.getTime() + 150 * 24 * 60 * 60 * 1000), // +150 días desde inicio
          end: new Date(actualStartDate.getTime() + 185 * 24 * 60 * 60 * 1000),   // +185 días desde inicio
          probability: 0.85,
          maxIntensity: 4
        },
        {
          start: new Date(actualStartDate.getTime() + 250 * 24 * 60 * 60 * 1000), // +250 días desde inicio
          end: new Date(actualStartDate.getTime() + 280 * 24 * 60 * 60 * 1000),   // +280 días desde inicio
          probability: 0.9,
          maxIntensity: 4
        }
      ];
      
      // Patrón semanal (los desarrolladores suelen contribuir menos en fines de semana)
      const weekdayProbability = [
        0.3,  // Domingo
        0.75, // Lunes
        0.85, // Martes
        0.9,  // Miércoles
        0.85, // Jueves
        0.7,  // Viernes
        0.2   // Sábado
      ];
      
      // Generar contribuciones para cada día en el rango
      let currentDate = new Date(actualStartDate);
      
      // Calcular número de días entre fechas
      const dayCount = Math.floor((endDate.getTime() - actualStartDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
      
      // Calcular número de semanas para establecer el ancho del gráfico
      setWeekCount(Math.ceil(dayCount / 7) + 1); // +1 para asegurar que cubra todo
      
      for (let i = 0; i < dayCount; i++) {
        const dateKey = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const dayOfWeek = currentDate.getDay();
        
        // Probabilidad base según día de la semana
        let probability = weekdayProbability[dayOfWeek];
        let maxIntensity = 3;
        
        // Comprobar si está en periodo de alta actividad
        highActivityPeriods.forEach(period => {
          if (currentDate >= period.start && currentDate <= period.end) {
            probability = period.probability;
            maxIntensity = period.maxIntensity;
          }
        });
        
        // Generar intensidad basada en probabilidad
        const random = Math.random();
        let intensity = 0;
        
        if (random < probability) {
          // Distribución exponencial para simular que la mayoría de días tienen pocas contribuciones
          // y solo algunos días tienen muchas
          const r = Math.random();
          
          if (r < 0.7) {
            intensity = 1;
          } else if (r < 0.85) {
            intensity = 2;
          } else if (r < 0.95) {
            intensity = 3;
          } else {
            intensity = maxIntensity;
          }
        }
        
        contributions[dateKey] = intensity;
        
        // Avanzar al siguiente día
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return contributions;
    };
    
    setContributionData(generateContributions());
    
    // Simular tiempo de carga para animación
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, [actualStartDate, endDate]);
  
  // Obtener los días de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  // para las columnas del gráfico
  const getDayOfWeek = (date: Date): number => {
    return date.getDay();
  };
  
  // Generar matriz para renderizar el gráfico
  const getContributionMatrix = () => {
    const matrix: number[][] = Array(rows).fill(0).map(() => Array(weekCount).fill(-1));
    
    let currentDate = new Date(actualStartDate);
    const startDayOfWeek = getDayOfWeek(currentDate);
    
    // Llenar la matriz con los datos de contribución
    // La primera semana puede estar parcialmente llena
    for (let col = 0; col < weekCount; col++) {
      for (let row = 0; row < rows; row++) {
        // En la primera columna, solo llenar desde el día de inicio
        if (col === 0 && row < startDayOfWeek) {
          matrix[row][col] = -1; // -1 indica celda fuera del rango
          continue;
        }
        
        const currentDateKey = currentDate.toISOString().split('T')[0];
        
        // Si la fecha está dentro del rango, usar el valor de contribución
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
  
  // Generar mensaje para el tooltip simulando actividad de GitHub
  const getTooltipMessage = (intensity: number, date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const commitMessages = [
      "feat: Updated site UI",
      "fix: Corrected responsive layout",
      "chore: Code cleanup",
      "docs: Updated documentation",
      "style: Improved dark mode",
      "refactor: Optimized performance",
      "test: Added unit tests"
    ];
    
    // Número de commits según intensidad
    const commitsNumber = intensity === 0 ? 0 : intensity * 2 - 1 + Math.floor(Math.random() * 3);
    
    if (intensity === 0) {
      return `No contributions on ${month} ${day}, ${year}`;
    }
    
    // Mensaje aleatorio para el tooltip
    const randomMessage = commitMessages[Math.floor(Math.random() * commitMessages.length)];
    
    return `${commitsNumber} contributions on ${month} ${day}, ${year}\n${randomMessage}`;
  };
  
  // Componente de celda de contribución individual
  const ContributionCell: React.FC<ContributionCellProps> = ({ intensity, date }) => {
    // Paleta de colores de GitHub en modo oscuro (exactamente igual a GitHub)
    const colors = [
      '#161b22', // Sin contribuciones
      '#0e4429', // Nivel 1
      '#006d32', // Nivel 2
      '#26a641', // Nivel 3
      '#39d353'  // Nivel 4
    ];
  
    const [isHovered, setIsHovered] = useState(false);
    
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      
      // Calcular posición para el tooltip
      const rect = e.currentTarget.getBoundingClientRect();
      const graphRect = graphRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      
      setTooltip({
        content: getTooltipMessage(intensity, date),
        visible: true,
        x: rect.left - graphRect.left + cellSize / 2,
        y: rect.top - graphRect.top - 10
      });
    };
    
    const handleMouseLeave = () => {
      setIsHovered(false);
      setTooltip({...tooltip, visible: false});
    };

    // Si intensity es -1, esta celda está fuera del rango de fechas
    if (intensity === -1) {
      return (
        <div 
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            margin: `${cellMargin}px`,
            visibility: 'hidden'
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
          borderRadius: `${Math.max(1, cellSize/6)}px`,
          margin: `${cellMargin}px`,
          transition: 'background-color 0.2s ease',
          opacity: isLoaded ? 1 : 0,
          transitionDelay: `${Math.random() * 300}ms` // Efecto aleatorio para simular carga de datos
        }}
        className={isHovered ? 'transform scale-105' : ''}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`Contribución nivel ${intensity}`}
        role="gridcell"
      />
    );
  };
  
  // Generar etiquetas de los meses (similar a GitHub)
  const renderMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    let currentDate = new Date(actualStartDate);
    let currentMonth = currentDate.getMonth();
    
    // Posicionar etiquetas de mes
    for (let week = 0; week < weekCount; week++) {
      // Si es un nuevo mes o es la primera semana, agregar etiqueta
      if (currentDate.getMonth() !== currentMonth || week === 0) {
        currentMonth = currentDate.getMonth();
        
        labels.push({
          text: months[currentMonth],
          position: week
        });
      }
      
      // Avanzar 7 días
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return (
      <div className="flex text-xs text-gray-500 mb-1 position-relative" style={{ height: '20px' }}>
        {labels.map((label, index) => (
          <div 
            key={`month-${index}`} 
            style={{
              position: 'absolute',
              left: `${label.position * (cellSize + cellMargin * 2) + (cellSize + cellMargin * 2) * 0.8}px`,
            }}
          >
            {label.text}
          </div>
        ))}
      </div>
    );
  };

  // Generar etiquetas de los días de la semana (similar a GitHub)
  const renderDayLabels = () => {
    const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    
    return (
      <div className="flex flex-col mr-2 text-xs text-gray-500 justify-around h-full">
        {days.map((day, index) => (
          <div key={index} className="h-[12px] leading-[12px]" style={{height: `${cellSize}px`, lineHeight: `${cellSize}px`}}>
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  // Obtener la matriz de contribuciones
  const matrix = getContributionMatrix();
  
  return (
    <div className="flex flex-col items-center justify-center my-8 w-full overflow-hidden">
      <div 
        className="p-2 sm:p-4 rounded-lg bg-[#0d1116] border border-gray-800 relative"
        ref={graphRef}
      >
        {/* Etiquetas de meses (arriba) */}
        {renderMonthLabels()}
        
        <div className="flex items-center">
          {/* Etiquetas de días (izquierda) */}
          {renderDayLabels()}
          
          {/* Matriz de contribuciones */}
          <div 
            className="flex flex-nowrap overflow-x-auto hide-scrollbar"
            style={{ 
              maxWidth: '100%',
              scrollbarWidth: 'none' // Firefox
            }}
            role="grid"
            aria-label="GitHub Contribution Graph"
          >
            {matrix.length > 0 ? (
              <div className="flex">
                {Array.from({ length: weekCount }).map((_, col) => (
                  <div key={`col-${col}`} className="flex flex-col">
                    {Array.from({ length: rows }).map((_, row) => {
                      // Calcular la fecha para esta celda
                      const cellDate = new Date(actualStartDate);
                      cellDate.setDate(cellDate.getDate() + (col * 7) + row - getDayOfWeek(actualStartDate));
                      
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
              <p className="text-gray-400 text-sm">Generando gráfico de contribuciones...</p>
            )}
          </div>
        </div>
        
        {/* Leyenda (abajo) */}
        <div className="flex justify-end items-center mt-2 text-xs text-gray-500">
          <span className="mr-1">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div 
              key={`legend-${level}`}
              className="inline-block mx-[2px]"
              style={{
                backgroundColor: level === 0 ? '#161b22' : 
                               level === 1 ? '#0e4429' : 
                               level === 2 ? '#006d32' : 
                               level === 3 ? '#26a641' : '#39d353',
                width: '10px',
                height: '10px',
                borderRadius: '2px'
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
              transform: 'translate(-50%, -100%)',
              filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))',
              pointerEvents: 'none'
            }}
          >
            {tooltip.content}
            <div 
              className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-800 border-r border-b border-gray-700" 
              style={{ transform: 'translateX(-50%) rotate(45deg)' }} 
            />
          </div>
        )}
      </div>
      
      {/* Estilo para ocultar la barra de desplazamiento en Webkit */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default GitHubContributionGraph;