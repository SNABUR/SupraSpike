"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createChart } from 'lightweight-charts';
import { supabase } from '@/lib/supabase';

const TradingViewChart = ({ tokenAddress, graphData }) => {
  const chartContainerRef = useRef();
  const candleSeriesRef = useRef();
  const [candles, setCandles] = useState([]);
  
  useEffect(() => {
    if (!graphData?.length) return;

    const processHistoricalData = (data) => {
      const interval = 5 * 60 * 1000;
      const candleMap = new Map();
      let previousClose = null;

      data.sort((a, b) => a.timestamp - b.timestamp).forEach(trade => {
        const timestamp = new Date(trade.timestamp).getTime();
        const candleStart = Math.floor(timestamp / interval) * interval;
        const price = trade.virtualTokenReserves !== 0 
          ? trade.virtualSupraReserves / trade.virtualTokenReserves 
          : 0;

        if (previousClose !== null) {
          const lastCandleTime = Array.from(candleMap.keys()).pop() || candleStart;
          const missingCandles = Math.floor((candleStart - lastCandleTime) / interval) - 1;
          
          for (let i = 1; i <= missingCandles; i++) {
            const fillTime = lastCandleTime + (i * interval);
            candleMap.set(fillTime, {
              time: fillTime / 1000,
              open: previousClose,
              high: previousClose,
              low: previousClose,
              close: previousClose
            });
          }
        }

        const existingCandle = candleMap.get(candleStart);
        if (!existingCandle) {
          candleMap.set(candleStart, {
            time: candleStart / 1000,
            open: previousClose ?? price,
            high: price,
            low: price,
            close: price
          });
        } else {
          existingCandle.high = Math.max(existingCandle.high, price);
          existingCandle.low = Math.min(existingCandle.low, price);
          existingCandle.close = price;
        }
        
        previousClose = candleMap.get(candleStart).close;
      });

      return Array.from(candleMap.values()).sort((a, b) => a.time - b.time);
    };

    setCandles(processHistoricalData(graphData));
  }, [graphData]);

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
        mode: 2,
        autoScale: true,
        borderColor: 'rgba(144, 164, 174, 0.2)',
        scaleMargins: { top: 0.15, bottom: 0.25 },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
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
        priceFormatter: (price) => price.toFixed(8).replace(/\.?0+$/, '') || '0',
      },
    });

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
      borderVisible: false,
    });

    const resizeObserver = new ResizeObserver(([entry]) => {
      chart.applyOptions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(chartContainerRef.current);
    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  const sortedCandles = useMemo(() => 
    [...candles].sort((a, b) => a.time - b.time), 
    [candles]
  );

  useEffect(() => {
    if (candleSeriesRef.current && sortedCandles.length) {
      candleSeriesRef.current.setData(sortedCandles);
      chartContainerRef.current?.chart?.timeScale().fitContent();
    }
  }, [sortedCandles]);

  const processTrade = useCallback((trade) => {
    const interval = 5 * 60 * 1000; // 5 minutos
    const price = trade.virtualTokenReserves !== 0 
      ? trade.virtualSupraReserves / trade.virtualTokenReserves 
      : 0;
    
    const timestamp = trade.timestamp * 1000;
    const candleStart = Math.floor(timestamp / interval) * interval;
    const candleTime = candleStart / 1000;

    setCandles(prev => {
      const currentCandles = [...prev].sort((a, b) => a.time - b.time);
      const lastCandle = currentCandles[currentCandles.length - 1];

      if (lastCandle && candleTime > lastCandle.time + (interval / 1000)) {
        const missingCandles = Math.floor(
          (candleTime - lastCandle.time) / (interval / 1000)
        ) - 1;

        for (let i = 1; i <= missingCandles; i++) {
          currentCandles.push({
            time: lastCandle.time + (i * (interval / 1000)),
            open: lastCandle.close,
            high: lastCandle.close,
            low: lastCandle.close,
            close: lastCandle.close
          });
        }
      }

      if (!lastCandle || candleTime > lastCandle.time) {
        currentCandles.push({
          time: candleTime,
          open: lastCandle?.close ?? price,
          high: price,
          low: price,
          close: price
        });
      } else {
        const updatedCandle = {
          ...lastCandle,
          high: Math.max(lastCandle.high, price),
          low: Math.min(lastCandle.low, price),
          close: price
        };
        currentCandles[currentCandles.length - 1] = updatedCandle;
      }

      return currentCandles.slice(-200); 
    });
  }, []);

  useEffect(() => {
    if (!tokenAddress) return;

    const subscription = supabase
      .channel(`realtime-trades-${tokenAddress}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'TradeEvent',
          filter: `tokenAddress=eq.${tokenAddress}`
        },
        (payload) => {
          processTrade(payload.new);
        }
      )
      .subscribe()

    return () => {
      subscription?.unsubscribe();
    };
  }, [tokenAddress, processTrade]);

  return (
    <div className="h-full w-full bg-black relative flex flex-col">
      <div className="flex-1 w-full">
        <div ref={chartContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default TradingViewChart;