export interface LegoBlockProps {
  x: number;
  y: number;
  width: number;
  colorIndex: number;
}

export interface LegoColor {
  fill: string;
  stroke: string;
  shadow: string;
}

export interface BlockConfiguration {
  gap: number;
  widths: number[];
  rowGap: number;
}
