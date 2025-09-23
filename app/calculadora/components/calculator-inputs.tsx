"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  DollarSign,
  Users,
  Target,
  Repeat,
  TrendingUp,
  Calculator,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalculatorInputs as ICalculatorInputs,
  CALCULATOR_CONFIG,
} from "@/lib/types/calculator";
import {
  formatCurrency,
  formatPercentage,
  parseNumber,
  clamp,
} from "@/app/calculadora/lib/utils";

interface CalculatorInputsProps {
  inputs: ICalculatorInputs;
  onInputChange: (field: keyof ICalculatorInputs, value: number) => void;
  onCalculate?: () => void;
  validationErrors?: string[];
  isCalculating?: boolean;
  canCalculate?: boolean;
  autoCalculate?: boolean;
}

interface InputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: "currency" | "percentage" | "number" | "customers";
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
}

function InputField({
  id,
  label,
  value,
  onChange,
  type = "number",
  min = 0,
  max,
  step = 1,
  tooltip,
  placeholder,
  icon,
  error,
}: InputFieldProps) {
  const [displayValue, setDisplayValue] = useState(value.toString());

  const formatValue = (val: number): string => {
    switch (type) {
      case "currency":
        return val.toString();
      case "percentage":
        return val.toString();
      case "customers":
        return Math.floor(val).toString();
      default:
        return val.toString();
    }
  };

  const parseValue = (val: string): number => {
    const parsed = parseNumber(val, 0);
    if (max !== undefined) return clamp(parsed, min, max);
    return Math.max(parsed, min);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);

    // Parse and validate
    const numValue = parseValue(newValue);
    onChange(numValue);
  };

  const handleBlur = () => {
    // Format display value on blur
    setDisplayValue(formatValue(value));
  };

  const getPrefix = () => {
    switch (type) {
      case "currency":
        return "$";
      default:
        return "";
    }
  };

  const getSuffix = () => {
    switch (type) {
      case "percentage":
        return "%";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="relative">
        {getPrefix() && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {getPrefix()}
          </div>
        )}

        <Input
          id={id}
          type="number"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`${getPrefix() ? "pl-8" : ""} ${
            getSuffix() ? "pr-8" : ""
          } ${error ? "border-red-500" : ""}`}
        />

        {getSuffix() && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {getSuffix()}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function CalculatorInputs({
  inputs,
  onInputChange,
  onCalculate,
  validationErrors = [],
  isCalculating = false,
  canCalculate = true,
  autoCalculate = true,
}: CalculatorInputsProps) {
  const hasErrors = validationErrors.length > 0;

  return (
    <div className="space-y-6">
      {/* Modelo de Producto Único */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span>Modelo de Producto Único</span>
          </CardTitle>
          <CardDescription>
            Configura los parámetros de tu producto de venta única
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="oneTimePrice"
              label="Precio del Producto"
              value={inputs.oneTimePrice}
              onChange={(value) => onInputChange("oneTimePrice", value)}
              type="currency"
              min={1}
              max={10000}
              placeholder="97"
              icon={<DollarSign className="h-4 w-4" />}
              tooltip="Precio de venta del producto único (típicamente $47-$197 para infoproductos)"
            />

            <InputField
              id="oneTimeCost"
              label="Costo por Cliente"
              value={inputs.oneTimeCost}
              onChange={(value) => onInputChange("oneTimeCost", value)}
              type="currency"
              min={0}
              max={1000}
              placeholder="20"
              icon={<TrendingUp className="h-4 w-4" />}
              tooltip="Costo de adquisición por cliente (marketing, plataformas, etc.)"
            />

            <InputField
              id="oneTimeCustomers"
              label="Clientes Objetivo"
              value={inputs.oneTimeCustomers}
              onChange={(value) => onInputChange("oneTimeCustomers", value)}
              type="customers"
              min={1}
              max={100000}
              placeholder="1000"
              icon={<Users className="h-4 w-4" />}
              tooltip="Número total de clientes que planeas alcanzar"
            />

            <InputField
              id="conversionRate"
              label="Tasa de Conversión"
              value={inputs.conversionRate}
              onChange={(value) => onInputChange("conversionRate", value)}
              type="percentage"
              min={0.1}
              max={50}
              step={0.1}
              placeholder="2.5"
              icon={<Target className="h-4 w-4" />}
              tooltip="Porcentaje de visitantes que se convierten en clientes (típicamente 1-5%)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modelo de Suscripción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Repeat className="h-5 w-5 text-green-600" />
            <span>Modelo de Suscripción</span>
          </CardTitle>
          <CardDescription>
            Configura los parámetros de tu modelo de suscripción mensual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="subscriptionPrice"
              label="Precio Mensual"
              value={inputs.subscriptionPrice}
              onChange={(value) => onInputChange("subscriptionPrice", value)}
              type="currency"
              min={1}
              max={1000}
              placeholder="29"
              icon={<DollarSign className="h-4 w-4" />}
              tooltip="Precio mensual de la suscripción (típicamente $9-$97 para micro-SaaS)"
            />

            <InputField
              id="subscriptionCost"
              label="Costo Mensual por Cliente"
              value={inputs.subscriptionCost}
              onChange={(value) => onInputChange("subscriptionCost", value)}
              type="currency"
              min={0}
              max={500}
              placeholder="5"
              icon={<TrendingUp className="h-4 w-4" />}
              tooltip="Costo mensual por cliente (servidor, soporte, procesamiento, etc.)"
            />

            <InputField
              id="churnRate"
              label="Tasa de Abandono"
              value={inputs.churnRate}
              onChange={(value) => onInputChange("churnRate", value)}
              type="percentage"
              min={0}
              max={50}
              step={0.1}
              placeholder="5"
              icon={<Users className="h-4 w-4" />}
              tooltip="Porcentaje de clientes que cancelan mensualmente (típicamente 3-10%)"
            />

            <InputField
              id="timeHorizon"
              label="Horizonte Temporal (meses)"
              value={inputs.timeHorizon}
              onChange={(value) => onInputChange("timeHorizon", value)}
              type="number"
              min={CALCULATOR_CONFIG.MIN_TIME_HORIZON}
              max={CALCULATOR_CONFIG.MAX_TIME_HORIZON}
              placeholder="24"
              icon={<Calculator className="h-4 w-4" />}
              tooltip="Período de tiempo para la comparación (12-60 meses recomendado)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuración Avanzada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Configuración Avanzada</span>
            <Badge variant="secondary" className="ml-2">
              Opcional
            </Badge>
          </CardTitle>
          <CardDescription>
            Ajusta parámetros avanzados para cálculos más precisos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <InputField
              id="discountRate"
              label="Tasa de Descuento"
              value={inputs.discountRate}
              onChange={(value) => onInputChange("discountRate", value)}
              type="percentage"
              min={0}
              max={50}
              step={0.1}
              placeholder="10"
              icon={<Calculator className="h-4 w-4" />}
              tooltip="Tasa de descuento para calcular el valor presente (típicamente 8-15%)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Errores de Validación */}
      {hasErrors && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-800">
                Corrige los siguientes errores:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón de Cálculo Manual */}
      {!autoCalculate && (
        <>
          <Separator />
          <div className="flex justify-center">
            <Button
              onClick={onCalculate}
              disabled={!canCalculate || isCalculating}
              size="lg"
              className="w-full md:w-auto"
            >
              {isCalculating ? (
                <>
                  <Calculator className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcular Comparación
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
