"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const intervals = [
  { value: '1m', label: '1 Minuto' },
  { value: '3m', label: '3 Minutos' },
  { value: '5m', label: '5 Minutos' },
  { value: '15m', label: '15 Minutos' },
  { value: '30m', label: '30 Minutos' },
  { value: '1h', label: '1 Hora' },
];

const TradingViewChart = ({ graphData }) => {
  const chartContainerRef = useRef();
  const candleSeriesRef = useRef();
  const [interval, setInterval] = useState('5m');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: { background: { color: '#000000' }, textColor: '#ffffff' },
      grid: {
        vertLines: {
          color: '#404040',
        },
        horzLines: {
          color: '#404040',
        },
      },
      priceScale: {
        autoScale: true,
        mode: 1, // Escala logarítmica
        priceFormat: {
          type: 'custom',
          formatter: (price) => {
            if (price < 1e-6) {
              return price.toExponential(2); // Notación científica para valores muy pequeños
            } else if (price < 1) {
              return price.toFixed(6); // 6 decimales para valores menores a 1
            } else {
              return price.toFixed(2); // 2 decimales para valores grandes
            }
          },
        },
      },
      crossHair: {
        mode: 0,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      priceFormat: {
        type: 'price',  // Tipo de formato
        precision: 8,       // Muestra hasta 8 decimales
        minMove: 0.00000001 // Incrementos en el orden de 10^-8
      },
    });
        candleSeriesRef.current = candleSeries;

    const scaledData = graphData.map((item) => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candleSeries.setData(scaledData);

    // Limpia el gráfico al desmontar el componente
    return () => {
      chart.remove();
    };
  }, [graphData]);

  return (
    <div className="h-full w-full bg-black relative flex flex-col">
      <select
        value={interval}
        onChange={(e) => setInterval(e.target.value)}
        className="mb-2 w-min bg-gray-800 text-white border border-gray-600 rounded p-2"
      >
        {intervals.map((intvl) => (
          <option key={intvl.value} value={intvl.value}>
            {intvl.label}
          </option>
        ))}
      </select>
  
      <div className="flex-1 w-full">
        <div ref={chartContainerRef} className="h-full w-full relative" />
      </div>
    </div>
  );
  
};

export default TradingViewChart;
