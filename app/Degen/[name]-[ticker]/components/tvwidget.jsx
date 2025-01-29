"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart } from 'lightweight-charts';
import { supabase } from '@/lib/supabase'; // Importar cliente de Supabase

const TradingViewChart = ({ tokenAddress, graphData }) => {
  const chartContainerRef = useRef();
  const candleSeriesRef = useRef();
  const [candles, setCandles] = useState([]);
  const [currentCandle, setCurrentCandle] = useState(null);

  // 1. Procesar datos iniciales
  useEffect(() => {
    if (!graphData?.length) return;

    const processHistoricalData = (data) => {
      const candleMap = {};
      let previousClose = null;
    
      data.sort((a, b) => a.timestamp - b.timestamp).forEach(trade => {
        const timestamp = new Date(trade.timestamp).getTime();
        const interval = 5 * 60 * 1000;
        const candleStart = Math.floor(timestamp / interval) * interval;
        const price = trade.virtualSupraReserves / trade.virtualTokenReserves;
    
        // Rellenar huecos anteriores
        if (previousClose !== null) {
          const prevCandleEnd = Object.keys(candleMap).length > 0 
            ? Math.max(...Object.keys(candleMap).map(Number)) 
            : null;
    
          if (prevCandleEnd && candleStart > prevCandleEnd + interval) {
            for (let t = prevCandleEnd + interval; t < candleStart; t += interval) {
              candleMap[t] = {
                time: t / 1000,
                open: previousClose,
                high: previousClose,
                low: previousClose,
                close: previousClose
              };
            }
          }
        }
    
        if (!candleMap[candleStart]) {
          candleMap[candleStart] = {
            time: candleStart / 1000,
            open: previousClose !== null ? previousClose : price,
            high: price,
            low: price,
            close: price
          };
        } else {
          candleMap[candleStart] = {
            ...candleMap[candleStart],
            high: Math.max(candleMap[candleStart].high, price),
            low: Math.min(candleMap[candleStart].low, price),
            close: price
          };
        }
    
        previousClose = candleMap[candleStart].close;
      });
    
      return Object.values(candleMap)
      .sort((a, b) => a.time - b.time) // Ordenar ASC
      .filter(c => c.time !== null);
    };

    const initialCandles = processHistoricalData(graphData);
    setCandles(initialCandles);
    setCurrentCandle(initialCandles[initialCandles.length - 1]);
  }, [graphData]);

  // 2. Configuración del gráfico
  useEffect(() => {
    if (!chartContainerRef.current) return;
  
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#000' },
        textColor: 'rgba(144, 164, 174, 0.9)',
      },
      priceScale: {
        mode: 2, // Modo logarítmico
        autoScale: true,
        alignLabels: true,
        borderColor: 'rgba(144, 164, 174, 0.2)',
        scaleMargins: {
          top: 0.15, // Más espacio arriba para labels
          bottom: 0.25,
        },
        minimumHeight: 80, // Previene solapamiento
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(144, 164, 174, 0.3)',
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        },
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(144, 164, 174, 0.05)' },
      },
      localization: {
        priceFormatter: (price) => {
          // Formato inteligente: elimina ceros innecesarios
          return price.toFixed(8).replace(/\.?0+$/, '') || '0';
        },
      },
    });
  
    // Configuración avanzada de velas
    candleSeriesRef.current = chart.addCandlestickSeries({
      priceFormat: {
        type: 'custom',
        minMove: 0.00000001,
        formatter: (price) => price.toFixed(8).replace(/\.?0+$/, ''),
      },
      wickUpColor: '#26a69a',
      upColor: '#26a69a',
      wickDownColor: '#ef5350',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickVisible: true,
      borderVisible: false,
    });
  
    // Ajustes de visualización inicial
    chart.timeScale().applyOptions({
      rightOffset: 12, // Espacio al borde derecho
      barSpacing: 6, // Espaciado entre velas
    });
  
    // Auto-ajuste responsivo
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        chart.applyOptions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
          layout: { fontSize: 12 * window.devicePixelRatio },
        });
      }
    });
  
    resizeObserver.observe(chartContainerRef.current);
  
    // Limpieza
    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // 3. Actualizar gráfico
  useEffect(() => {
    if (!candleSeriesRef.current || !candles.length) return;
    
    const isSorted = candles.every((c, i) => 
      i === 0 || c.time > candles[i-1].time
    );
    
    if (!isSorted) {
      console.error('Datos no ordenados:', candles);
      return;
    }
    
    candleSeriesRef.current.setData(candles);
    // ... resto
  }, [candles, currentCandle]);

  // 4. Manejo de actualizaciones en tiempo real
  const processNewTrade = useCallback((trade) => {
    const price = trade.virtualTokenReserves !== 0 
      ? trade.virtualSupraReserves / trade.virtualTokenReserves 
      : 0;
  
    const timestamp = trade.timestamp * 1000; // Suponiendo que trade.timestamp está en segundos
    const interval = 5 * 60 * 1000; // 5 minutos en milisegundos
    const candleStart = Math.floor(timestamp / interval) * interval;
    const candleTime = candleStart / 1000; // Convertir a segundos para Lightweight Charts
  
    setCandles(prev => {
      // 1. Ordenar siempre las velas existentes
      const sortedCandles = [...prev].sort((a, b) => a.time - b.time);
      const lastCandle = sortedCandles[sortedCandles.length - 1]; // Última vela REAL
  
      // 2. Determinar si es nueva vela
      const isNewCandle = !lastCandle || candleTime > lastCandle.time;
  
      // 3. Lógica para nueva vela
      if (isNewCandle) {
        // Rellenar huecos entre la última vela y la nueva
        let newCandles = [...sortedCandles];
        if (lastCandle) {
          const missingIntervals = Math.floor((candleTime - lastCandle.time) / (interval / 1000)) - 1;
          
          for (let i = 1; i <= missingIntervals; i++) {
            const ghostTime = lastCandle.time + (i * (interval / 1000));
            newCandles.push({
              time: ghostTime,
              open: lastCandle.close,
              high: lastCandle.close,
              low: lastCandle.close,
              close: lastCandle.close
            });
          }
        }
  
        // Añadir nueva vela
        const newCandle = {
          time: candleTime,
          open: lastCandle ? lastCandle.close : price,
          high: price,
          low: price,
          close: price
        };
        newCandles.push(newCandle);
  
        // 4. Ordenar y limitar a 200 velas
        const sorted = newCandles.sort((a, b) => a.time - b.time).slice(-200);
        setCurrentCandle(newCandle);
        return sorted;
      }
  
      // 5. Actualizar vela existente
      const updatedCandle = {
        ...lastCandle,
        high: Math.max(lastCandle.high, price),
        low: Math.min(lastCandle.low, price),
        close: price
      };
  
      const updatedCandles = [
        ...sortedCandles.slice(0, -1),
        updatedCandle
      ];
  
      setCurrentCandle(updatedCandle);
      return updatedCandles;
    });
  }, []);
  

  // 5. Suscripción a Supabase
  useEffect(() => {
    if (!tokenAddress) return;

    const channel = supabase
      .channel(`realtime-trades-${tokenAddress}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'TradeEvent',
        filter: `tokenAddress=eq.${tokenAddress}`
      }, (payload) => {
        processNewTrade(payload.new);
      })
      .subscribe();

      return () => {
        supabase.removeChannel(channel).catch(console.error);
      };
        }, [tokenAddress, processNewTrade]);

  return (
        <div className="h-full w-full bg-black relative flex flex-col">
        <div className="flex-1 w-full">
          <div ref={chartContainerRef} className="h-full w-full" />
        </div>
      </div>
  );
};

export default TradingViewChart;