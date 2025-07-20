import React, { useRef, useEffect } from 'react';

// This is a React wrapper for the Svelte Cart component
const SvelteCartWrapper = ({ SvelteComponent }) => {
  const containerRef = useRef(null);
  const componentRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && SvelteComponent && !componentRef.current) {
      componentRef.current = new SvelteComponent({
        target: containerRef.current,
      });
    }

    return () => {
      if (componentRef.current) {
        componentRef.current.$destroy();
        componentRef.current = null;
      }
    };
  }, [SvelteComponent]);

  return <div ref={containerRef} />;
};

export default SvelteCartWrapper;
