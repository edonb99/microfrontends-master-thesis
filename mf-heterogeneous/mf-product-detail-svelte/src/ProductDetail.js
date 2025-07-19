import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailSvelte from './ProductDetail.svelte';

function ProductDetail() {
  const { id } = useParams();
  const containerRef = useRef(null);
  const svelteComponentRef = useRef(null);

  useEffect(() => {
    // Clean up previous component if it exists
    if (svelteComponentRef.current) {
      svelteComponentRef.current.$destroy();
    }

    // Create new Svelte component
    if (containerRef.current) {
      svelteComponentRef.current = new ProductDetailSvelte({
        target: containerRef.current,
        props: {
          productId: id || '1'
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (svelteComponentRef.current) {
        svelteComponentRef.current.$destroy();
        svelteComponentRef.current = null;
      }
    };
  }, [id]);

  return <div ref={containerRef} />;
}

export default ProductDetail;
