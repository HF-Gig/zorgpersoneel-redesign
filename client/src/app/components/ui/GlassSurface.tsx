/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useId, forwardRef } from 'react';
import './GlassSurface.css';

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: 'R' | 'G' | 'B';
  yChannel?: 'R' | 'G' | 'B';
  mixBlendMode?: string;
  className?: string;
  style?: React.CSSProperties;
}

const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {}
}, ref) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(false);

  const localContainerRef = useRef<HTMLDivElement | null>(null);
  const feImageRef = useRef<SVGFEImageElement | null>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  // Sync forwarded ref with local ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(localContainerRef.current);
    } else {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = localContainerRef.current;
    }
  }, [ref]);

  const generateDisplacementMap = () => {
    const rect = localContainerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute('href', generateDisplacementMap());
  };

  useEffect(() => {
    updateDisplacementMap();
    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset }
    ].forEach(({ ref: targetRef, offset }) => {
      if (targetRef.current) {
        targetRef.current.setAttribute('scale', (distortionScale + offset).toString());
        targetRef.current.setAttribute('xChannelSelector', xChannel);
        targetRef.current.setAttribute('yChannelSelector', yChannel);
      }
    });

    gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString());
  }, [
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode
  ]);

  useEffect(() => {
    if (!localContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0);
    });

    resizeObserver.observe(localContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setTimeout(updateDisplacementMap, 0);
  }, [width, height]);

  useEffect(() => {
    setSvgSupported(false); // Force fallback to CSS backdrop-filter for pure transparent glass rendering
  }, []);

  const supportsSVGFilters = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {
      return false;
    }

    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${filterId})`;

    return div.style.backdropFilter !== '';
  };

  const containerStyle: React.CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    // @ts-ignore
    '--glass-frost': backgroundOpacity,
    // @ts-ignore
    '--glass-saturation': saturation,
    // @ts-ignore
    '--filter-id': `url(#${filterId})`
  };

  return (
    <div
      ref={localContainerRef}
      className={`glass-surface ${svgSupported ? 'glass-surface--svg' : 'glass-surface--fallback'} ${className}`}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div className="glass-surface__content">{children}</div>
    </div>
  );
});

GlassSurface.displayName = 'GlassSurface';

export default GlassSurface;
