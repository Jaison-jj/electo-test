'use client';

import { useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const libraries: any = ['places'];

const PlacesAutocompleteInput = (props: any) => {
  const {
    className,
    label,
    requiredField,
    onSelectPlace,
    address,
    setAddress,
  } = props;

  const [autocomplete, setAutocomplete] = useState<any>(null);
  const inputRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        componentRestrictions: {
          country: 'us',
        },
      },
    );

    setAutocomplete(autocompleteInstance);

    return () => {
      if (autocompleteInstance) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!autocomplete) return;

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || '');
      onSelectPlace(place);
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autocomplete]);

  if (loadError) return <div>Error place api</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='flex flex-col gap-2 w-full'>
      {label && (
        <label className='font-normal text-sm text-muted-foreground'>
          {label}
          {requiredField && <span className='text-red-600'>*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type='text'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={cn(
          `flex h-10 w-full rounded-xl border border-input 
         px-3 py-2 text-sm ring-offset-background 
        file:border-0 file:bg-transparent file:text-sm file:font-medium 
        placeholder:text-muted-foreground focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
        disabled:cursor-not-allowed`,
          className,
        )}
        {...props}
      />
    </div>
  );
};

export default PlacesAutocompleteInput;
