import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Delete, Star, StarBorder } from '@mui/icons-material';
import { ProductImage } from '../../types/Product';
import AdobeCommerceService from '../../../services/AdobeCommerceService';

interface MediaUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxFiles?: number;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  images,
  onChange,
  maxFiles = 10,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const newImages: ProductImage[] = [...images];

    try {
      for (const file of acceptedFiles) {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Create form data for Adobe Commerce media upload
        const formData = new FormData();
        formData.append('file', file);

        // Upload to Adobe Commerce
        const response = await AdobeCommerceService.getInstance({
          baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
          accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
        }).uploadProductMedia(formData, (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.round((progress.loaded * 100) / progress.total),
          }));
        });

        // Add new image to list
        newImages.push({
          id: response.id,
          url: response.url,
          alt: file.name,
          position: newImages.length,
          isMain: newImages.length === 0, // First image is main by default
        });
      }

      onChange(newImages);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [images, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - images.length,
    disabled: uploading || images.length >= maxFiles,
  });

  const handleDelete = async (imageId: string) => {
    try {
      await AdobeCommerceService.getInstance({
        baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
        accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
      }).deleteProductMedia(imageId);

      const newImages = images.filter(img => img.id !== imageId);
      onChange(newImages);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSetMain = (imageId: string) => {
    const newImages = images.map(img => ({
      ...img,
      isMain: img.id === imageId,
    }));
    onChange(newImages);
  };

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    
    // Update positions
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      position: index,
    }));
    
    onChange(reorderedImages);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Product Images
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 1,
            p: 3,
            mb: 2,
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <CircularProgress size={24} sx={{ mb: 1 }} />
              <Typography>Uploading images...</Typography>
            </Box>
          ) : (
            <Typography>
              {isDragActive
                ? 'Drop the images here...'
                : images.length >= maxFiles
                ? 'Maximum number of images reached'
                : 'Drag and drop images here, or click to select files'}
            </Typography>
          )}
        </Box>

        <ImageList sx={{ width: '100%', height: 'auto' }} cols={4} gap={8}>
          {images.map((image, index) => (
            <ImageListItem key={image.id}>
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <ImageListItemBar
                title={image.alt}
                actionIcon={
                  <Box>
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={() => handleSetMain(image.id)}
                    >
                      {image.isMain ? <Star /> : <StarBorder />}
                    </IconButton>
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={() => handleDelete(image.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>

        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <Box key={fileName} sx={{ mt: 1 }}>
            <Typography variant="caption">{fileName}</Typography>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={16}
              sx={{ ml: 1 }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default MediaUpload;
