import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

interface ProductGalleryProps {
  images: Array<{
    url: string;
    label: string;
    position: number;
  }>;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse">
      {/* Image selector */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.Group as="div" className="flex flex-wrap gap-4">
          {images.map((image) => (
            <Tab
              key={image.position}
              className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-primary-500 focus:ring-offset-4"
            >
              {({ selected }) => (
                <>
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <img
                      src={image.url}
                      alt={image.label}
                      className="h-full w-full object-cover object-center"
                    />
                  </span>
                  <span
                    className={clsx(
                      selected ? 'ring-primary-500' : 'ring-transparent',
                      'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </Tab>
          ))}
        </Tab.Group>
      </div>

      {/* Main image */}
      <div className="aspect-h-1 aspect-w-1 w-full">
        <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
          {images.map((image) => (
            <Tab.Panel key={image.position}>
              <img
                src={currentImage.url}
                alt={currentImage.label}
                className="h-full w-full object-cover object-center sm:rounded-lg"
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </div>
  );
};
